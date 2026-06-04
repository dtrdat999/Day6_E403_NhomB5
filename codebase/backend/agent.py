import os
import json
import re
import requests
import unicodedata
from database import mock_transactions

class MoniAgent:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key
        self.model_name = 'google/gemini-2.5-flash-lite'
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"

    def extract_keywords(self, query: str) -> list[str]:
        stop_words = ['tôi', 'bạn', 'là', 'có', 'không', 'và', 'hoặc', 'cho', 'của', 'vừa', 'mới']
        # remove punctuation and lowercase
        query = re.sub(r'[^\w\s\u00C0-\u1EF9]', '', query.lower())
        words = query.split()
        return [word for word in words if len(word) > 1 and word not in stop_words]

    def normalize_text(self, text: str) -> str:
        normalized = unicodedata.normalize('NFD', text.lower())
        return ''.join(char for char in normalized if unicodedata.category(char) != 'Mn')

    def retrieve_relevant_context(self, query: str, frontend_txs: list[dict], max_results=10):
        keywords = self.extract_keywords(query)
        data_source = frontend_txs if frontend_txs else mock_transactions
        if not keywords:
            return data_source[:max_results]
        
        scored_transactions = []
        for tx in data_source:
            score = 0
            tx_text = f"{tx.get('name', '')} {tx.get('description', '')} {tx.get('recipient', '')} {tx.get('type', '')} {tx.get('category', '')}".lower()
            
            for kw in keywords:
                if kw in tx_text:
                    score += 1
                    
            scored_transactions.append((tx, score))
            
        relevant = [item[0] for item in scored_transactions if item[1] >= 1]
        relevant.sort(key=lambda x: next((item[1] for item in scored_transactions if item[0] == x), 0), reverse=True)
        
        if not relevant:
            relevant = data_source
            
        return relevant[:max_results]

    def generate_response(self, messages: list[dict], permission_granted: bool, transactions: list[dict] = None) -> str:
        if transactions is None:
            transactions = []
            
        last_user_message = next((m for m in reversed(messages) if m.get('role') == 'user'), None)
        query = last_user_message.get('content', '') if last_user_message else ''
        
        context_data = ''
        if permission_granted:
            relevant_transactions = self.retrieve_relevant_context(query, transactions)
            context_data = json.dumps(relevant_transactions, ensure_ascii=False)
            
        system_instruction = f"""Bạn là Moni, trợ lý AI tài chính trên MoMo. Trả lời ngắn gọn, thân thiện, xưng 'mình' gọi 'bạn'.

Quyền dữ liệu: {'CÓ' if permission_granted else 'KHÔNG'}.
- Nếu KHÔNG có quyền và user hỏi số liệu: trả lời cần quyền, thêm `<<PERMISSION_REQUEST>>` cuối câu.
- Nếu CÓ quyền, dữ liệu: {context_data if context_data else 'không có'}

Khi user khai chi tiêu mới: hỏi xác nhận danh mục, thêm `<<CLASSIFY_SUGGESTION>> {{"suggestions": ["DM1", "DM2", "DM3"]}}` cuối câu.

Khi user đổi phân loại giao dịch có sẵn: thêm `<<UPDATE_TRANSACTION>> {{"id": "<tx_id>", "category": "<new>"}}` cuối câu."""

        api_messages = [{"role": "system", "content": system_instruction}]
        
        for m in messages:
            role = 'assistant' if m.get('role') in ['assistant', 'model'] else 'user'
            api_messages.append({"role": role, "content": m.get('content', '')})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "MoniChat",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model_name,
            "messages": api_messages,
            "temperature": 0.2,
            "max_tokens": 512
        }
        
        response = requests.post(self.api_url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return data['choices'][0]['message']['content']
        else:
            error_data = response.json() if response.headers.get('content-type', '').startswith('application/json') else {}
            error_msg = error_data.get('error', {}).get('message', response.text)
            raise Exception(f"OpenRouter Error ({response.status_code}): {error_msg}")

    def generate_fallback_response(
        self,
        messages: list[dict],
        permission_granted: bool,
        transactions: list[dict] = None,
        error: str | None = None,
    ) -> str:
        if transactions is None:
            transactions = []

        last_user_message = next((m for m in reversed(messages) if m.get('role') == 'user'), None)
        query = last_user_message.get('content', '').lower() if last_user_message else ''
        query_norm = self.normalize_text(query)
        data_source = transactions if transactions else mock_transactions

        data_keywords = [
            'chi tieu', 'thang', 'tong', 'giao dich', 'google',
            'phan tich', 'phan loai', 'bat thuong', 'rui ro',
            'giao dich la', 'nhac', 'hoa don', 'dinh ky',
        ]
        asks_for_data = any(keyword in query_norm for keyword in data_keywords)

        if asks_for_data and not permission_granted:
            return (
                "Mình cần quyền truy cập dữ liệu giao dịch để trả lời chính xác phần này. "
                "Bạn cho phép Moni đọc dữ liệu mẫu trong prototype nhé. <<PERMISSION_REQUEST>>"
            )

        expenses = [
            tx for tx in data_source
            if (
                tx.get('amount', 0) < 0
                or tx.get('type') == 'expense'
            )
            and not tx.get('excludeFromExpense', False)
        ]
        total_expense = sum(abs(tx.get('amount', 0)) for tx in expenses)
        unclassified = [
            tx for tx in expenses
            if 'chưa' in str(tx.get('category', '')).lower()
            or tx.get('confidence') in ['low', 'medium']
        ]
        google_tx = next(
            (
                tx for tx in expenses
                if 'google' in f"{tx.get('name', '')} {tx.get('description', '')}".lower()
            ),
            None,
        )
        recurring = [
            tx for tx in expenses
            if any(
                keyword in f"{tx.get('name', '')} {tx.get('description', '')}".lower()
                for keyword in ['internet', 'điện', 'thuê', 'gym', 'phòng']
            )
        ]

        if 'google' in query_norm and google_tx:
            return (
                f"Mình đang chạy chế độ demo offline nên chưa gọi được AI cloud, nhưng vẫn phân tích được dữ liệu mẫu. "
                f"Khoản Google là -{abs(google_tx.get('amount', 0)):,}đ, hiện có thể bị xếp chưa chắc chắn. "
                "Nếu đây là Google Workspace/Drive phục vụ học tập hoặc làm việc, bạn nên đổi sang "
                "\"Học tập / Công cụ\" để báo cáo tháng chính xác hơn."
            ).replace(',', '.')

        if 'phan loai' in query_norm or 'chua' in query_norm:
            return (
                f"Mình thấy có {len(unclassified)} giao dịch cần kiểm tra lại phân loại. "
                "Các khoản có độ tin cậy thấp/trung bình nên để người dùng xác nhận, đặc biệt là Google "
                "và các giao dịch chuyển tiền cá nhân."
            )

        if 'bat thuong' in query_norm or 'rui ro' in query_norm or 'giao dich la' in query_norm:
            return (
                "Mình chưa thấy dấu hiệu gian lận rõ ràng trong dữ liệu mẫu, nhưng nên kiểm tra các giao dịch "
                "tên chung chung hoặc chuyển tiền cá nhân có số tiền lớn vì AI không đủ ngữ cảnh để tự kết luận."
            )

        if 'nhac' in query_norm or 'hoa don' in query_norm or 'dinh ky' in query_norm:
            return (
                f"Mình phát hiện {len(recurring)} khoản có dấu hiệu định kỳ. "
                "Trong prototype, bạn có thể dùng luồng nhắc thanh toán để mô phỏng việc nhắc trước ngày đến hạn."
            )

        if asks_for_data:
            return (
                f"Mình đang chạy chế độ demo offline. Tổng chi tiêu mẫu hiện là {total_expense:,}đ "
                f"với {len(expenses)} giao dịch chi tiêu; có {len(unclassified)} giao dịch nên kiểm tra lại phân loại."
            ).replace(',', '.')

        return (
            "Backend Moni đang chạy. Hiện AI cloud không khả dụng nên mình trả lời bằng chế độ demo offline; "
            "bạn vẫn có thể thử các câu hỏi về chi tiêu, phân loại giao dịch, cảnh báo rủi ro và nhắc thanh toán."
        )
