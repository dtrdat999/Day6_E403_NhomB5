import { useState, useRef, useEffect } from 'react';
import { Transaction, calculateTotalExpense, formatCurrency, groupByCategory, getUnclassifiedTransactions, getRecurringTransactions } from '../data/transactions';

interface MoniChatProps {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction | undefined> | void;
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'moni';
  text: string;
  cards?: CardData[];
  buttons?: ButtonData[];
  pathTag?: string;
}

interface CardData {
  label: string;
  value: string;
  confidence?: string;
  riskLevel?: string;
}

interface ButtonData {
  label: string;
  action: string;
}

export default function MoniChat({ transactions, onUpdateTransaction, onBack }: MoniChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'moni',
      text: 'Xin chào! Tôi là Moni — trợ lý tài chính AI của bạn.\n\nĐể phân tích chi tiêu, xem giao dịch và lưu thay đổi phân loại, Moni cần quyền truy cập dữ liệu giao dịch mẫu trong prototype. Bạn có cho phép không?',
      buttons: [
        { label: '✅ Cho phép truy cập', action: 'grant-permission' },
        { label: '❌ Không cho phép', action: 'deny-permission' },
      ],
      pathTag: '🔒 Yêu cầu quyền truy cập',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [googleCorrected, setGoogleCorrected] = useState(false);
  const [pendingChip, setPendingChip] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [pendingTransactionLookup, setPendingTransactionLookup] = useState(false);
  const [hasDataPermission, setHasDataPermission] = useState<boolean | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const chips = [
    '📊 Phân tích tháng này',
    '🏷️ Phân loại chi tiêu',
    '🔍 Tìm giao dịch lạ',
    '📱 Giải thích khoản Google',
    '🔔 Nhắc thanh toán định kỳ',
  ];

  const addMoniMessageWithDelay = (moniMsg: Omit<Message, 'id' | 'role'>) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const moni: Message = {
        id: `moni-${Date.now()}`,
        role: 'moni',
        ...moniMsg,
      };
      setMessages(prev => [...prev, moni]);
    }, 1500);
  };

  const addMessagesWithDelay = (userText: string, moniMsg: Omit<Message, 'id' | 'role'>) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText,
    };
    setMessages(prev => [...prev, userMsg]);
    addMoniMessageWithDelay(moniMsg);
  };

  const permissionPrompt: Omit<Message, 'id' | 'role'> = {
    text: 'Trước khi xử lý yêu cầu này, Moni cần quyền đọc dữ liệu giao dịch và lưu lại thay đổi phân loại. Bạn có cho phép không?',
    buttons: [
      { label: '✅ Cho phép truy cập', action: 'grant-permission' },
      { label: '❌ Không cho phép', action: 'deny-permission' },
    ],
    pathTag: '🔒 Yêu cầu quyền truy cập',
  };

  const matchFAQ = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('tháng này') || lowerText.includes('tổng chi') || lowerText.includes('phân tích')) return '📊 Phân tích tháng này';
    if (lowerText.includes('chưa phân loại') || (lowerText.includes('phân loại') && lowerText.includes('chi tiêu'))) return '🏷️ Phân loại chi tiêu';
    if (lowerText.includes('giao dịch lạ') || lowerText.includes('bất thường') || lowerText.includes('đáng ngờ')) return '🔍 Tìm giao dịch lạ';
    if (lowerText.includes('google') || lowerText.includes('giải thích')) return '📱 Giải thích khoản Google';
    if (lowerText.includes('định kỳ') || lowerText.includes('nhắc nhở') || lowerText.includes('hóa đơn')) return '🔔 Nhắc thanh toán định kỳ';
    return null;
  };

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');

  const findMentionedTransaction = (text: string) => {
    const normalizedText = normalizeText(text);

    return transactions.find(tx => {
      const normalizedName = normalizeText(tx.name);
      const nameWords = normalizedName.split(/\s+/).filter(word => word.length > 1);
      const matchedWords = nameWords.filter(word => normalizedText.includes(word)).length;
      const hasFullName = normalizedText.includes(normalizedName);
      const hasEnoughNameWords = nameWords.length === 1
        ? matchedWords === 1
        : matchedWords >= Math.min(2, nameWords.length);

      return hasFullName || hasEnoughNameWords;
    });
  };

  const getCategoryOptions = (tx: Transaction) => {
    const normalizedTx = normalizeText(`${tx.name} ${tx.description} ${tx.note || ''}`);
    const txWords = normalizedTx.split(/\W+/).filter(Boolean);
    const hasWord = (words: string[]) => words.some(word => txWords.includes(word));

    if (normalizedTx.includes('google')) {
      return ['Học tập / Công cụ làm việc', 'Giải trí', 'Cần kiểm tra'];
    }

    if (hasWord(['an', 'uong', 'bua', 'trua', 'cafe', 'ca', 'phe'])) {
      return ['Ăn uống', 'Chuyển khoản cá nhân', 'Trả nợ'];
    }

    if (normalizedTx.includes('mua ho') || normalizedTx.includes('my pham') || normalizedTx.includes('son')) {
      return ['Mua sắm', 'Chuyển khoản cá nhân', 'Trả nợ'];
    }

    if (normalizedTx.includes('concert') || normalizedTx.includes('phim') || normalizedTx.includes('ve')) {
      return ['Giải trí', 'Mua sắm', 'Chuyển khoản cá nhân'];
    }

    return ['Ăn uống', 'Mua sắm', 'Chuyển khoản cá nhân', 'Trả nợ'];
  };

  const getConfidenceLabel = (confidence: Transaction['confidence']) => {
    if (confidence === 'high') return 'Cao';
    if (confidence === 'medium') return 'Trung bình';
    return 'Thấp';
  };

  const buildClassificationReview = (tx: Transaction): Omit<Message, 'id' | 'role'> => ({
    text: `Mình tìm thấy giao dịch của **${tx.name}**.\n\nPhân loại hiện tại: **${tx.category}**\nĐộ tin cậy: **${getConfidenceLabel(tx.confidence)}**\n\n${tx.note ? `Ghi chú AI: ${tx.note}\n\n` : ''}Bạn có thể giữ nguyên hoặc đổi sang một danh mục phù hợp hơn.`,
    cards: [
      {
        label: tx.name,
        value: `${tx.amount < 0 ? '-' : '+'}${formatCurrency(tx.amount)}`,
        confidence: `${tx.date} ${tx.time} • ${tx.description}`,
      },
      {
        label: 'Phân loại hiện tại',
        value: tx.category,
        confidence: `Độ tin cậy: ${getConfidenceLabel(tx.confidence)}`,
      },
    ],
    buttons: [
      ...getCategoryOptions(tx).map(category => ({
        label: category === 'Cần kiểm tra' ? `⚠️ ${category}` : `✏️ Đổi sang ${category}`,
        action: `set-category|${tx.id}|${category}`,
      })),
      { label: '✅ Giữ nguyên phân loại', action: `keep-transaction|${tx.id}` },
    ],
    pathTag: '🏷️ Xem lại phân loại',
  });

  const respondToUser = (
    userText: string,
    moniMsg: Omit<Message, 'id' | 'role'>,
    addUserMessage = true,
  ) => {
    if (addUserMessage) {
      addMessagesWithDelay(userText, moniMsg);
    } else {
      addMoniMessageWithDelay(moniMsg);
    }
  };

  const handleLocalTransactionIntent = (userText: string, addUserMessage = true) => {
    const normalizedText = normalizeText(userText);
    const isClassificationIntent =
      normalizedText.includes('phan loai') ||
      normalizedText.includes('danh muc') ||
      normalizedText.includes('category') ||
      normalizedText.includes('ten nguoi nhan') ||
      normalizedText.includes('nguoi nhan');

    if (!pendingTransactionLookup && !isClassificationIntent) return false;

    const tx = findMentionedTransaction(userText);
    if (tx) {
      setPendingTransactionLookup(false);
      respondToUser(userText, buildClassificationReview(tx), addUserMessage);
      return true;
    }

    setPendingTransactionLookup(true);
    respondToUser(userText, {
      text: 'Bạn muốn xem lại phân loại của giao dịch nào? Hãy nhập tên người nhận hoặc tên giao dịch, ví dụ: "Nguyễn Minh Anh" hoặc "Google Play".',
      pathTag: '🏷️ Cần tên giao dịch',
    }, addUserMessage);
    return true;
  };

  const postChat = async (payload: unknown) => {
    const endpoints = ['/api/chat', 'http://127.0.0.1:8000/api/chat'];
    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) return res;
        lastError = new Error(`Backend error ${res.status}`);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Backend unavailable');
  };

  const processPermittedText = async (userText: string, addUserMessage = true) => {
    const matchedFAQ = matchFAQ(userText);
    if (matchedFAQ) {
      handleChip(matchedFAQ, false, addUserMessage);
      return;
    }

    if (handleLocalTransactionIntent(userText, addUserMessage)) {
      return;
    }

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', text: userText };
    if (addUserMessage) {
      setMessages(prev => [...prev, userMsg]);
    }
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role === 'moni' ? 'model' : 'user', content: m.text }));
      const payload = {
        messages: chatHistory,
        permissionGranted: hasDataPermission || false,
        transactions: transactions
      };

      const res = await postChat(payload);

      const data = await res.json();
      let replyText = data.content;

      if (replyText.includes('<<PERMISSION_REQUEST>>')) {
        replyText = replyText.replace('<<PERMISSION_REQUEST>>', '').trim();
        setPendingText(userText);
        setMessages(prev => [...prev, {
          id: `moni-${Date.now()}`,
          role: 'moni',
          text: replyText || 'Để trả lời, Moni cần quyền truy cập dữ liệu giao dịch.',
          buttons: [
            { label: '✅ Cho phép truy cập', action: 'grant-permission' },
            { label: '❌ Không cho phép', action: 'deny-permission' },
          ],
          pathTag: '🔒 Yêu cầu quyền truy cập',
        }]);
        setIsTyping(false);
        return;
      }

      let wasUpdated = false;
      const updateRegex = /<<UPDATE_TRANSACTION>>\s*(\{.*?\})/g;
      let match;
      while ((match = updateRegex.exec(replyText)) !== null) {
        try {
          const cmd = JSON.parse(match[1]);
          if (cmd.id && cmd.category) {
            await onUpdateTransaction(cmd.id, { category: cmd.category, confidence: 'high' });
            wasUpdated = true;
          }
        } catch(e) {}
      }
      replyText = replyText.replace(updateRegex, '').trim();

      const classifyRegex = /<<CLASSIFY_SUGGESTION>>\s*(\{.*?\})/g;
      let buttons: ButtonData[] | undefined = undefined;
      const classifyMatch = classifyRegex.exec(replyText);
      if (classifyMatch) {
        try {
          const cmd = JSON.parse(classifyMatch[1]);
          if (cmd.suggestions && Array.isArray(cmd.suggestions)) {
            buttons = cmd.suggestions.map((s: string) => ({ label: `✏️ ${s}`, action: 'none' }));
          }
        } catch(e) {}
        replyText = replyText.replace(classifyRegex, '').trim();
      }

      setMessages(prev => [...prev, {
        id: `moni-${Date.now()}`,
        role: 'moni',
        text: replyText,
        buttons,
        pathTag: wasUpdated ? '✅ Tự động cập nhật' : '💬 Phản hồi AI',
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `moni-${Date.now()}`,
        role: 'moni',
        text: 'Xin lỗi, kết nối đến Moni AI (Backend) đang gặp sự cố. Bạn vui lòng kiểm tra xem Backend đã chạy ở cổng 8000 chưa nhé!',
        pathTag: '🚫 Lỗi kết nối',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText('');

    if (hasDataPermission !== true) {
      setPendingText(userText);
      setPendingChip(null);
      setPendingTransactionLookup(false);
      addMessagesWithDelay(userText, permissionPrompt);
      return;
    }

    await processPermittedText(userText);
  };

  const handleChip = (chip: string, overridePermission: boolean = false, addUserMessage = true) => {
    const isPermitted = overridePermission || hasDataPermission;
    const reply = (moniMsg: Omit<Message, 'id' | 'role'>) => {
      respondToUser(chip, moniMsg, addUserMessage);
    };

    if (isPermitted === false) {
      reply({
        text: 'Xin lỗi, tôi không được phép truy cập dữ liệu giao dịch của bạn nên không thể thực hiện yêu cầu này. 😔',
        pathTag: '🚫 Từ chối quyền',
      });
      return;
    }

    if (isPermitted === null) {
      setPendingChip(chip);
      setPendingText(null);
      reply(permissionPrompt);
      return;
    }

    const totalExpense = calculateTotalExpense(transactions);
    const categories = groupByCategory(transactions);
    const unclassified = getUnclassifiedTransactions(transactions);
    const recurring = getRecurringTransactions(transactions);
    const googleTx = transactions.find(t => t.id === 'tx1')!;
    const currentGoogleCat = googleCorrected ? 'Học tập / Công cụ làm việc' : googleTx.category;

    // Tạo top 3 categories text
    const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const topCatsText = sortedCats.slice(0, 5).map(([cat, amt]) => `• ${cat}: ${formatCurrency(amt)}`).join('\n');

    switch (chip) {
      case '📊 Phân tích tháng này':
        reply({
          text: `📊 **Báo cáo chi tiêu tháng 6/2026**\n\nTổng chi: ${formatCurrency(totalExpense)}\nSố giao dịch: ${transactions.filter(t => t.amount < 0 && !t.excludeFromExpense).length}\n\n📋 Top danh mục:\n${topCatsText}\n\n💡 **Nhận xét của Moni:**\n• Khoản lớn nhất: Thuê phòng ${formatCurrency(3500000)}\n• Có ${unclassified.length} giao dịch chưa phân loại cần kiểm tra\n• Khoản Google Play ${formatCurrency(49000)} đang bị gán "Giải trí" — có thể cần đổi sang "Học tập"\n• Phát hiện ${recurring.length} khoản định kỳ có thể đặt nhắc`,
          buttons: [
            { label: '✏️ Sửa khoản Google Play', action: 'explain-google' },
            { label: '📋 Phân loại giao dịch chưa rõ', action: 'classify' },
            { label: '🔍 Tìm giao dịch lạ', action: 'suspicious' },
            { label: '🔔 Xem khoản định kỳ', action: 'show-recurring' },
          ],
          pathTag: '✅ Happy Path',
        });
        break;

      case '🏷️ Phân loại chi tiêu':
        if (unclassified.length === 0) {
          reply({
            text: '🏷️ Tất cả giao dịch trong dữ liệu hiện tại đã có phân loại độ tin cậy cao. Bạn vẫn có thể hỏi tên một giao dịch cụ thể để xem lại hoặc đổi danh mục.',
            pathTag: '✅ Đã phân loại xong',
          });
        } else {
          reply({
            text: `🏷️ Tôi tìm thấy ${unclassified.length} giao dịch cần bạn xác nhận phân loại:`,
            cards: unclassified.slice(0, 5).map(tx => ({
              label: tx.name,
              value: `${tx.amount < 0 ? '-' : '+'}${formatCurrency(tx.amount)}`,
              confidence: `→ ${tx.category} • Độ tin cậy: ${getConfidenceLabel(tx.confidence)}`,
            })),
            buttons: [
              ...unclassified.slice(0, 3).map(tx => ({
                label: `📝 Xem/sửa ${tx.name}`,
                action: `review-transaction|${tx.id}`,
              })),
              { label: '✅ Giữ nguyên tất cả', action: 'keep' },
              { label: '💡 Xem lý do AI phân loại', action: 'reason' },
            ],
            pathTag: '⚠️ Low-confidence Path',
          });
        }
        break;

      case '🔍 Tìm giao dịch lạ':
        reply({
          text: '🔍 Tôi chưa thấy dấu hiệu gian lận nghiêm trọng. Tuy nhiên, có một số khoản đáng chú ý:',
          cards: [
            { label: '1. Google Play', value: `-${formatCurrency(49000)}`, riskLevel: '🟡 Cần kiểm tra', confidence: 'Tên chung chung, MoMo gán "Giải trí" nhưng có thể là công cụ làm việc.' },
            { label: '2. Nguyễn Phương Linh', value: `-${formatCurrency(650000)}`, riskLevel: '🟡 Cần kiểm tra', confidence: 'Khoản lớn chuyển cho cá nhân, chưa rõ mục đích (vé concert? mua hộ?).' },
            { label: '3. Bùi Lan Anh', value: `-${formatCurrency(300000)}`, riskLevel: '🟡 Cần kiểm tra', confidence: 'Chuyển tiền cá nhân, không có ghi chú rõ ràng.' },
          ],
          buttons: [
            { label: '🔎 Giải thích khoản Google', action: 'explain-google' },
            { label: '📝 Phân loại khoản Phương Linh', action: 'classify-npl' },
          ],
          pathTag: '⚠️ Low-confidence Path',
        });
        break;

      case '📱 Giải thích khoản Google':
        reply({
          text: `📱 Khoản Google Play -${formatCurrency(49000)} ngày 04/06/2026\n\n🔎 Phân tích: Giao dịch qua Google Play Store có thể đến từ:\n• YouTube Premium / YouTube Music\n• Google One (lưu trữ đám mây)\n• Ứng dụng/game trả phí\n• Google Workspace (công cụ làm việc)\n\n⚠️ Hiện Moni đang xếp là "${currentGoogleCat}" với độ tin cậy **Trung bình**.\n\nNếu bạn dùng khoản này cho học tập hoặc công cụ làm việc (Google Workspace, Coursera qua Google...), hãy đổi sang "Học tập / Công cụ" để báo cáo chính xác hơn.`,
          buttons: googleCorrected ? [
            { label: '✅ Đã cập nhật thành công', action: 'none' },
          ] : [
            { label: '📚 Đổi sang Học tập / Công cụ', action: 'correct-google' },
            { label: '🎮 Giữ là Giải trí', action: 'keep-google' },
            { label: '⚠️ Đánh dấu cần kiểm tra', action: 'flag-google' },
          ],
          pathTag: '❌ Failure Path → Cần Correction',
        });
        break;

      case '🔔 Nhắc thanh toán định kỳ':
        reply({
          text: `🔔 Moni phát hiện ${recurring.length} khoản có dấu hiệu định kỳ:`,
          cards: recurring.map(tx => ({
            label: tx.name,
            value: `-${formatCurrency(Math.abs(tx.amount))}`,
            confidence: `${tx.description} • Ngày ${tx.date}`,
          })),
          buttons: reminderSet ? [
            { label: '✅ Đã đặt nhắc thành công', action: 'none' },
          ] : [
            { label: '🔔 Nhắc trước 3 ngày cho Viettel', action: 'remind-3' },
            { label: '📅 Nhắc đúng ngày cho tất cả', action: 'remind-0' },
            { label: '❌ Không cần nhắc', action: 'no-remind' },
          ],
          pathTag: '✅ Happy Path + Reminder',
        });
        break;
    }
  };

  const handleButton = async (action: string) => {
    if (action.startsWith('review-transaction|')) {
      const [, txId] = action.split('|');
      const tx = transactions.find(item => item.id === txId);

      if (tx) {
        addMessagesWithDelay(`Xem/sửa ${tx.name}`, buildClassificationReview(tx));
      }
      return;
    }

    if (action.startsWith('set-category|')) {
      const [, txId, ...categoryParts] = action.split('|');
      const category = categoryParts.join('|');
      const tx = transactions.find(item => item.id === txId);
      const oldCategory = tx?.category || 'Chưa phân loại';
      const confidence: Transaction['confidence'] = category === 'Cần kiểm tra' ? 'medium' : 'high';

      const savedTx = await onUpdateTransaction(txId, { category, confidence });
      if (txId === 'tx1' && category === 'Học tập / Công cụ làm việc') {
        setGoogleCorrected(true);
      }

      addMessagesWithDelay(category === 'Cần kiểm tra' ? 'Đánh dấu cần kiểm tra' : `Đổi sang ${category}`, {
        text: `✅ Đã cập nhật và lưu phân loại cho ${savedTx?.name || tx?.name || 'giao dịch này'}.\n\n"${oldCategory}" → "${savedTx?.category || category}"\n\nTừ giờ nếu bạn hỏi lại, Moni sẽ lấy danh mục mới nhất đã lưu.`,
        pathTag: '🔄 Correction Path — Đã cập nhật',
      });
      return;
    }

    if (action.startsWith('keep-transaction|')) {
      const [, txId] = action.split('|');
      const tx = transactions.find(item => item.id === txId);

      addMessagesWithDelay('Giữ nguyên phân loại', {
        text: `✅ Đã giữ nguyên phân loại${tx ? ` cho ${tx.name}` : ''}: "${tx?.category || 'hiện tại'}".`,
        pathTag: '✅ Giữ nguyên',
      });
      return;
    }

    switch (action) {
      case 'grant-permission':
        setHasDataPermission(true);
        const queuedText = pendingText;
        const queuedChip = pendingChip;
        addMessagesWithDelay('Cho phép', {
          text: queuedText || queuedChip
            ? 'Cảm ơn bạn! Moni đã được cấp quyền truy cập. Đang xử lý yêu cầu vừa rồi...'
            : 'Cảm ơn bạn! Moni đã được cấp quyền truy cập. Bây giờ bạn có thể hỏi Moni về chi tiêu, giao dịch và phân loại.',
          pathTag: '🔓 Đã cấp quyền',
        });
        if (queuedText) {
          setTimeout(() => {
            processPermittedText(queuedText, false);
          }, 3000);
          setPendingText(null);
        } else if (queuedChip) {
          setTimeout(() => {
            handleChip(queuedChip, true, false);
          }, 3000);
          setPendingChip(null);
        }
        break;

      case 'deny-permission':
        setHasDataPermission(false);
        setPendingChip(null);
        setPendingText(null);
        addMessagesWithDelay('Không cho phép', {
          text: 'Xin lỗi, tôi không được phép truy cập dữ liệu của bạn nên không thể thực hiện yêu cầu này. 😔',
          pathTag: '🚫 Từ chối quyền',
        });
        break;

      case 'correct-google':
        setGoogleCorrected(true);
        await onUpdateTransaction('tx1', { category: 'Học tập / Công cụ làm việc', confidence: 'high' });
        addMessagesWithDelay('Đổi sang Học tập / Công cụ', {
          text: `✅ Đã cập nhật và lưu thành công!\n\nKhoản Google Play đã được chuyển:\n"Giải trí" → "Học tập / Công cụ làm việc"\n\n📊 Báo cáo đã cập nhật:\n• Giải trí giảm ${formatCurrency(49000)}\n• Học tập / Công cụ tăng ${formatCurrency(49000)}\n\n🧠 Moni đã lưu vào database: lần sau hỏi lại khoản Google, Moni sẽ lấy phân loại mới nhất.`,
          pathTag: '🔄 Correction Path — Đã sửa thành công',
        });
        break;

      case 'remind-3':
      case 'remind-0':
        setReminderSet(true);
        const when = action === 'remind-3' ? 'trước 3 ngày' : 'đúng ngày';
        addMessagesWithDelay(action === 'remind-3' ? 'Nhắc trước 3 ngày' : 'Nhắc đúng ngày', {
          text: `🔔 Đã tạo nhắc thử nghiệm!\n\nMoni sẽ nhắc bạn ${when} cho các khoản:\n• Viettel Internet: ${formatCurrency(220000)}/tháng\n• Điện lực Hà Nội: ~${formatCurrency(675000)}/tháng\n• Thuê phòng: ${formatCurrency(3500000)}/tháng\n• Phòng gym Fit24: ${formatCurrency(550000)}/tháng\n\n📌 Đây là prototype nên reminder chỉ được mô phỏng trong giao diện.`,
          pathTag: '✅ Reminder Path',
        });
        break;

      case 'classify-nma':
        addMessagesWithDelay('Phân loại Nguyễn Minh Anh', {
          text: `❓ Khoản chuyển tiền đến Nguyễn Minh Anh -${formatCurrency(65000)}\nNội dung: "Chuyển tiền ăn trưa bạn chí"\n\n🤔 Moni đoán có thể là:\n• Chia tiền ăn uống\n• Chuyển khoản cá nhân\n• Trả nợ nhỏ\n\nBạn muốn phân loại vào nhóm nào?`,
          buttons: [
            { label: '🍜 Ăn uống', action: 'nma-food' },
            { label: '👤 Chuyển khoản cá nhân', action: 'nma-personal' },
            { label: '💰 Trả nợ', action: 'nma-debt' },
          ],
          pathTag: '⚠️ Low-confidence → User quyết định',
        });
        break;

      case 'nma-food':
      case 'nma-personal':
      case 'nma-debt': {
        const catMap: Record<string, string> = {
          'nma-food': 'Ăn uống',
          'nma-personal': 'Chuyển khoản cá nhân',
          'nma-debt': 'Trả nợ',
        };
        const cat = catMap[action];
        await onUpdateTransaction('tx2', { category: cat, confidence: 'high' });
        addMessagesWithDelay(cat, {
          text: `✅ Đã phân loại và lưu khoản Nguyễn Minh Anh vào "${cat}".\n\n🧠 Moni sẽ ghi nhớ trong database: lần sau hỏi lại Nguyễn Minh Anh, Moni sẽ trả về danh mục mới nhất.\n\n💡 Còn ${getUnclassifiedTransactions(transactions).length - 1} giao dịch chưa phân loại khác.`,
          pathTag: '🔄 Correction Path — User đã quyết định',
        });
        break;
      }

      case 'classify-npl':
        addMessagesWithDelay('Phân loại Nguyễn Phương Linh', {
          text: `❓ Khoản chuyển tiền đến Nguyễn Phương Linh -${formatCurrency(650000)}\nNội dung: "Chuyển tiền mua vé concert"\n\n🤔 Moni đoán có thể là:\n• Giải trí (vé concert)\n• Mua hộ\n• Chuyển khoản cá nhân\n\nBạn muốn phân loại vào nhóm nào?`,
          buttons: [
            { label: '🎵 Giải trí', action: 'npl-entertainment' },
            { label: '🛍️ Mua sắm / Mua hộ', action: 'npl-shopping' },
            { label: '👤 Chuyển khoản cá nhân', action: 'npl-personal' },
          ],
          pathTag: '⚠️ Low-confidence → User quyết định',
        });
        break;

      case 'npl-entertainment':
      case 'npl-shopping':
      case 'npl-personal': {
        const catMap2: Record<string, string> = {
          'npl-entertainment': 'Giải trí',
          'npl-shopping': 'Mua sắm',
          'npl-personal': 'Chuyển khoản cá nhân',
        };
        const cat2 = catMap2[action];
        await onUpdateTransaction('tx33', { category: cat2, confidence: 'high' });
        addMessagesWithDelay(cat2, {
          text: `✅ Đã phân loại và lưu khoản Nguyễn Phương Linh vào "${cat2}".\n\n🧠 Moni đã ghi nhớ trong database.`,
          pathTag: '🔄 Correction Path',
        });
        break;
      }

      case 'explain-google':
        handleChip('📱 Giải thích khoản Google');
        break;

      case 'classify':
        handleChip('🏷️ Phân loại chi tiêu');
        break;

      case 'suspicious':
        handleChip('🔍 Tìm giao dịch lạ');
        break;

      case 'show-recurring':
        handleChip('🔔 Nhắc thanh toán định kỳ');
        break;

      case 'reason':
        addMessagesWithDelay('Xem lý do AI phân loại', {
          text: '💡 Lý do phân loại của Moni AI:\n\n📱 **Google Play** — Trung bình:\nTên giao dịch từ Google Play/Services có thể là giải trí (YouTube, game) hoặc công cụ (Workspace, Drive). Moni chưa đủ context nên xếp Trung bình.\n\n👤 **Nguyễn Minh Anh** — Thấp:\nGiao dịch chuyển tiền cá nhân với nội dung "ăn trưa bạn chí" — có thể ăn uống, nhưng cũng có thể là cách ghi chú cá nhân. Moni không thể tự quyết định.\n\n👤 **Các khoản cá nhân khác** — Thấp:\nChuyển tiền P2P không có mã giao dịch rõ ràng từ merchant, Moni cần user xác nhận mục đích.',
          pathTag: '💡 Giải thích AI Reasoning (Explainable AI)',
        });
        break;

      case 'keep-google':
        addMessagesWithDelay('Giữ là Giải trí', {
          text: '✅ Đã giữ nguyên khoản Google Play trong danh mục "Giải trí".\n\n🧠 Moni sẽ ghi nhớ: Lần sau gặp giao dịch Google Play, Moni sẽ mặc định gán "Giải trí" với độ tin cậy Cao.',
        });
        break;

      case 'flag-google':
        addMessagesWithDelay('Đánh dấu cần kiểm tra', {
          text: '⚠️ Đã đánh dấu khoản Google Play là "Cần kiểm tra".\n\n📌 Gợi ý: Bạn nên kiểm tra biên lai trên Google Pay hoặc email xác nhận từ Google để xác định dịch vụ cụ thể.',
        });
        break;

      case 'keep':
        addMessagesWithDelay('Giữ nguyên tất cả', {
          text: '✅ Đã giữ nguyên tất cả phân loại hiện tại.\n\nBạn có thể quay lại bất cứ lúc nào để điều chỉnh nếu cần nhé! 😊',
        });
        break;

      case 'no-remind':
        addMessagesWithDelay('Không cần nhắc', {
          text: '✅ Đã bỏ qua. Moni sẽ không tạo nhắc cho các khoản định kỳ.\n\nBạn có thể bật lại bất cứ lúc nào.',
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className="screen chat-screen">
      {/* Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="chat-header-info">
          <img src="/moni-avatar.png" alt="Moni AI" className="chat-avatar-img" />
          <div>
            <div className="chat-name">Moni AI</div>
            <div className="chat-status">
              <span className="status-dot" />
              Trợ lý tài chính • Đang hoạt động
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === 'moni' && (
              <img src="/moni-avatar.png" alt="Moni" className="msg-avatar" />
            )}
            <div className="msg-bubble">
              {msg.pathTag && (
                <div className="path-tag">{msg.pathTag}</div>
              )}
              <div className="msg-text">{msg.text}</div>
              {msg.cards && (
                <div className="msg-cards">
                  {msg.cards.map((card, i) => (
                    <div key={i} className="msg-card">
                      <div className="msg-card-header">
                        <span className="msg-card-label">{card.label}</span>
                        <span className="msg-card-value">{card.value}</span>
                      </div>
                      {card.riskLevel && (
                        <div className="msg-card-risk">{card.riskLevel}</div>
                      )}
                      {card.confidence && (
                        <div className="msg-card-confidence">{card.confidence}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {msg.buttons && (
                <div className="msg-buttons">
                  {msg.buttons.map((btn, i) => (
                    <button
                      key={i}
                      className="msg-action-btn"
                      onClick={() => handleButton(btn.action)}
                      disabled={btn.action === 'none'}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator">
            <img src="/moni-avatar.png" alt="Moni" className="msg-avatar" />
            <div className="typing-bubble">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips + Input */}
      <div className="chat-bottom">
        <div className="suggested-chips">
          {chips.map(chip => (
            <button
              key={chip}
              className="chip"
              onClick={() => handleChip(chip)}
              disabled={isTyping}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Hỏi Moni bất kỳ điều gì..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            disabled={isTyping}
          />
          <button className="send-btn" onClick={handleSendText} disabled={isTyping || !inputText.trim()}>📤</button>
        </div>
      </div>
    </div>
  );
}
