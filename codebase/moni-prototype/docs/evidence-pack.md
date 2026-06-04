# Evidence Pack — Moni Tài Chính

**Nhóm:** (Tên nhóm)  
**Track:** D — Personal Finance  
**Product/app:** MoMo

---

## 1. Self-use evidence

Nhóm đã tự mở app MoMo, dùng thử và ghi nhận các observation sau:

### Observation 1: Thông tin tài chính bị phân tán
MoMo có rất nhiều card ưu đãi, ví trả sau, bảo hiểm, quảng cáo ngay trên trang chủ. Thông tin tài chính cá nhân (chi tiêu, lịch sử GD) bị đẩy xuống dưới hoặc phải bấm nhiều bước mới đến.

**Ảnh hưởng tới user:** User muốn kiểm tra chi tiêu phải cuộn qua rừng banner. Trải nghiệm giống "đi siêu thị" thay vì "kiểm tra ví".

### Observation 2: Lịch sử giao dịch có tổng chi nhưng thiếu giải thích
MoMo hiện có: tổng chi tháng, so với cùng kỳ, phân chia theo category. Tuy nhiên, không giải thích *vì sao* chi tiêu tăng so với tháng trước, khoản nào đóng góp chính vào mức tăng.

**Ảnh hưởng tới user:** User thấy "tăng 25%" nhưng không biết là do ăn uống tăng hay do một khoản lớn bất thường.

### Observation 3: Có giao dịch "Chưa phân loại"
Một số giao dịch (đặc biệt chuyển tiền cá nhân) hiện là "Chưa phân loại". MoMo không hỏi user phân loại, cũng không gợi ý category.

**Ảnh hưởng tới user:** Báo cáo chi tiêu không chính xác. User mất motivation theo dõi vì biết data không đúng.

### Observation 4: Moni chat chưa hiểu ngữ cảnh tự nhiên
Khi hỏi Moni: "tháng này mình tiêu bao nhiêu tiền ăn lẩu", Moni trả lời "Không tìm thấy thông tin". AI chưa hiểu semantic category (lẩu → ăn uống).

**Ảnh hưởng tới user:** User thử hỏi AI → nhận câu trả lời vô nghĩa → mất trust → không dùng lại.

### Observation 5: Quản lý chi tiêu tồn tại nhưng thiếu lớp giải thích
MoMo có mục "Trung tâm tài chính", "Quản lý chi tiêu" với biểu đồ cơ bản. Nhưng user vẫn cần một lớp giải thích dạng hội thoại — nói bằng ngôn ngữ tự nhiên thay vì đọc biểu đồ.

---

## 2. User/review/social evidence

> **Ghi chú:** Nhóm chưa có nguồn ngoài nhóm chính thức. Đây là giả định dựa trên quan sát và sẽ được kiểm bằng phỏng vấn nhanh 5 người dùng MoMo trước checkpoint.

### Bảng phỏng vấn nhanh (5 người)

| # | Câu hỏi | Người 1 | Người 2 | Người 3 | Người 4 | Người 5 |
|---|---|---|---|---|---|---|
| 1 | Bạn có thường xem lại lịch sử giao dịch MoMo không? | | | | | |
| 2 | Khi thấy tháng này tiêu nhiều, bạn có biết nguyên nhân chính không? | | | | | |
| 3 | Bạn có gặp giao dịch khó hiểu/chưa rõ mục đích không? | | | | | |
| 4 | Nếu có AI tài chính, bạn muốn nó giúp gì? | | | | | |

---

## 3. Competitor/analog evidence

| Sản phẩm | Có gì | Thiếu gì so với prototype |
|---|---|---|
| **Money Lover** | Phân loại chi tiêu, ngân sách, biểu đồ | Không có AI giải thích, không có conversational UI |
| **Timo/Cake** | Lịch sử giao dịch, thông báo biến động, insight cơ bản | Không có correction flow, không hỏi lại khi mơ hồ |
| **Expense tracker apps** | Manual category correction | Tốn thời gian, không có AI gợi ý |

---

## 4. Evidence → Insight

```text
User không chỉ cần xem lịch sử giao dịch.
Họ cần hiểu ý nghĩa phía sau mỗi giao dịch:
— khoản nào đang làm chi tiêu tăng,
— khoản nào chưa rõ mục đích,
— khoản nào cần kiểm tra,
— khoản nào nên được nhắc thanh toán định kỳ.
```

---

## 5. Evidence đổi SPEC

| Trước evidence | Sau evidence | Lý do |
|---|---|---|
| Nhóm định làm **chatbot tài chính chung** (free-text input, user tự nghĩ câu hỏi) | Nhóm đổi thành **AI action layer trên lịch sử giao dịch** với suggested prompts + correction flow | Chatbot trống khiến user không biết hỏi gì. Suggested prompts giúp user đi thẳng vào 4 task tài chính quan trọng nhất (phân loại, phát hiện lạ, giải thích, nhắc thanh toán). |
