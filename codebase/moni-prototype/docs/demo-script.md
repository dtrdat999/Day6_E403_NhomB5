# Demo Script — Moni Tài Chính (3-5 phút)

---

## Mở đầu (30 giây)

> "Đây là Hoàng — sinh viên năm 3, dùng MoMo hằng ngày để thanh toán, chuyển tiền, mua đồ online. Cuối tháng 6, Hoàng mở app và thấy chi tiêu tăng hơn tháng trước, nhưng không biết vì sao. Hoàng bắt đầu cuộn từng dòng giao dịch... và bỏ cuộc sau 2 phút."

> "Đây là pain thật mà nhóm em quan sát được khi tự dùng MoMo: lịch sử giao dịch có số liệu nhưng thiếu lớp giải thích."

---

## Demo Flow (3-4 phút)

### Bước 1: Home Screen (15 giây)
- Mở app → Trang chủ MoMo
- Chỉ vào card "Chi tiêu tháng 6" → có cảnh báo "Moni phát hiện giao dịch cần kiểm tra"
- Bấm **"Hỏi Moni"**

### Bước 2: Phân tích tháng — Happy Path ✅ (30 giây)
- Bấm chip **"Phân tích tháng này"**
- Moni trả lời: tổng chi, khoản lớn nhất (Google), giao dịch chưa phân loại (Nguyễn Đông Anh)
- **Nhấn mạnh:** "Đây là Happy Path — AI tự tin và đúng."

### Bước 3: Giải thích khoản Google — Failure Path ❌ (45 giây)
- Bấm **"Giải thích khoản Google"**
- Moni giải thích: có thể là YouTube, Google One, game, hoặc công cụ học tập
- Moni xếp là "Giải trí" nhưng ghi rõ "Độ chắc chắn: Trung bình"
- **Nhấn mạnh:** "Đây là Failure Path — AI phân loại sai. Hoàng dùng Google Workspace cho việc học, không phải giải trí."

### Bước 4: Sửa category — Correction Path 🔄 (30 giây)
- Bấm **"Đổi sang Học tập / Công cụ"**
- Moni cập nhật: "Giải trí giảm, Học tập tăng. Lần sau Moni sẽ hỏi lại."
- **Nhấn mạnh:** "Đây là Correction Path — user sửa AI, AI ghi nhớ. Đây là augmentation, không phải automation."

### Bước 5: Phân loại giao dịch chưa rõ — Low-confidence Path ⚠️ (30 giây)
- Bấm **"Phân loại chi tiêu"**
- Moni hiển thị 3 giao dịch cần xử lý, giao dịch Nguyễn Đông Anh ghi "Chưa chắc"
- Bấm "Phân loại Nguyễn Đông Anh" → Moni hỏi lại: Ăn uống / Chuyển khoản / Trả nợ
- **Nhấn mạnh:** "Đây là Low-confidence Path — AI không tự quyết mà hỏi lại user."

### Bước 6: Nhắc thanh toán — Reminder (30 giây)
- Bấm **"Nhắc thanh toán Viettel"**
- Moni phát hiện giao dịch định kỳ, gợi ý nhắc trước 3 ngày hoặc đúng ngày
- Chọn "Nhắc trước 3 ngày" → Moni xác nhận

---

## Kết luận (30 giây)

> "Nhóm em không build chatbot chung chung. Nhóm em build **AI action layer** trên workflow lịch sử giao dịch."

> "AI không tự quyết định tài chính mà hỗ trợ user hiểu, kiểm tra và xác nhận. Đây là **Augmentation** — user luôn là người quyết cuối."

> "Prototype thể hiện đủ 4 paths: Happy, Low-confidence, Failure, Correction — đúng với framework AI product mà khóa học yêu cầu."

---

## Checklist trước demo

- [ ] App chạy được trên localhost
- [ ] Đã test qua cả 5 chip
- [ ] Đã test correction flow (sửa Google)
- [ ] Đã test reminder flow (Viettel)
- [ ] Biết nói rõ đâu là Happy / Low-conf / Failure / Correction
- [ ] Biết nói rõ tại sao chọn Augmentation
