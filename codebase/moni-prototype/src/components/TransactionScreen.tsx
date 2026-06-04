import { Transaction, calculateTotalExpense, formatCurrency, MOCK_PREVIOUS_MONTH_TOTAL, groupByCategory } from '../data/transactions';
import TransactionItem from './TransactionItem';

interface TransactionScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: string) => void;
}

export default function TransactionScreen({ transactions, onNavigate }: TransactionScreenProps) {
  const totalExpense = calculateTotalExpense(transactions);
  const diff = totalExpense - MOCK_PREVIOUS_MONTH_TOTAL;
  const diffPercent = Math.round((diff / MOCK_PREVIOUS_MONTH_TOTAL) * 100);
  const categories = groupByCategory(transactions);
  const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxCatValue = sortedCats.length > 0 ? sortedCats[0][1] : 1;

  const sortedTx = [...transactions].sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('') + a.time.replace(':', '');
    const dateB = b.date.split('/').reverse().join('') + b.time.replace(':', '');
    return dateB.localeCompare(dateA);
  });

  const catColors: Record<string, string> = {
    'Nhà ở': '#ef4444',
    'Gia đình': '#f97316',
    'Ăn uống': '#eab308',
    'Mua sắm': '#a855f7',
    'Sức khỏe': '#22c55e',
    'Di chuyển': '#3b82f6',
    'Hóa đơn': '#06b6d4',
    'Học tập': '#14b8a6',
    'Giải trí': '#ec4899',
    'Từ thiện': '#f472b6',
    'Chưa phân loại': '#9ca3af',
  };

  return (
    <div className="screen transaction-screen">
      {/* Header */}
      <div className="tx-screen-header">
        <h2>Lịch sử giao dịch</h2>
      </div>

      {/* Search */}
      <div className="search-bar tx-search">
        <span className="search-icon">🔍</span>
        <span className="search-text">Tìm kiếm giao dịch</span>
      </div>

      {/* Month Summary */}
      <div className="month-summary">
        <div className="summary-header">
          <span className="summary-month">📅 Tổng quan tháng 6/2026</span>
        </div>
        <div className="summary-row">
          <div className="summary-stat">
            <span className="summary-label">Tổng chi</span>
            <span className="summary-value">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="summary-stat">
            <span className="summary-label">So với cùng kỳ</span>
            <span className={`summary-value ${diff > 0 ? 'increase' : 'decrease'}`}>
              {diff > 0 ? '↑' : '↓'} {Math.abs(diffPercent)}%
            </span>
          </div>
        </div>

        {/* Mini Category Bar Chart */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: '#1a1a2e' }}>
            Phân bổ chi tiêu
          </div>
          {sortedCats.slice(0, 5).map(([cat, amt]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, width: 70, color: '#6b7280', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{cat}</span>
              <div style={{ flex: 1, background: '#f3f4f6', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{
                  width: `${(amt / maxCatValue) * 100}%`,
                  height: '100%',
                  background: catColors[cat] || '#ae2070',
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a2e', width: 65, textAlign: 'right' as const, flexShrink: 0 }}>{formatCurrency(amt)}</span>
            </div>
          ))}
        </div>

        <button className="moni-cta small" onClick={() => onNavigate('chat')}>
          🤖 Hỏi Moni về chi tiêu này
        </button>
      </div>

      {/* Transaction List */}
      <div className="tx-list">
        <h3 className="tx-list-title">Giao dịch gần đây ({sortedTx.length})</h3>
        {sortedTx.map(tx => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </div>
    </div>
  );
}
