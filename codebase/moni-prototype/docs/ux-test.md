# UX Test Plan — Moni Tài Chính

## Mục tiêu test

Kiểm tra xem user có thể:
1. Tìm insight chi tiêu tháng qua Moni mà không cần hướng dẫn
2. Hiểu và tin tưởng kết quả phân loại/cảnh báo của AI
3. Phát hiện AI sai và tự sửa (correction flow)
4. Hoàn thành flow đặt nhắc thanh toán

---

## 4 Task cần test

### Task 1: Tìm vì sao tháng này chi tiêu tăng
- **Kịch bản:** "Bạn vừa mở MoMo và thấy chi tiêu tháng này tăng. Hãy tìm hiểu vì sao."
- **Expected path:** Home → Hỏi Moni → "Phân tích tháng này"
- **Quan sát:** User có tìm được nút "Hỏi Moni" không? Có bấm đúng chip không?

### Task 2: Phân loại giao dịch chưa rõ
- **Kịch bản:** "Moni nói có giao dịch chưa phân loại. Hãy phân loại nó."
- **Expected path:** "Phân loại chi tiêu" → Chọn category cho Nguyễn Đông Anh
- **Quan sát:** User có hiểu lựa chọn không? Có biết đây là AI đang hỏi lại không?

### Task 3: Kiểm tra giao dịch lạ
- **Kịch bản:** "Hãy kiểm tra xem có giao dịch nào bất thường không."
- **Expected path:** "Tìm giao dịch lạ" → Xem risk level → Giải thích khoản Google
- **Quan sát:** User có tin risk level không? Có phân biệt "Cần kiểm tra" vs "Rủi ro cao"?

### Task 4: Đặt nhắc thanh toán Viettel
- **Kịch bản:** "Bạn muốn được nhắc thanh toán Viettel hằng tháng."
- **Expected path:** "Nhắc thanh toán Viettel" → Chọn thời điểm nhắc
- **Quan sát:** User có hiểu đây là reminder prototype không?

---

## Metrics

| Metric | Cách đo |
|---|---|
| Tester có bấm được đúng chip không? | Quan sát trực tiếp: pass/fail |
| Tester có hiểu câu trả lời Moni không? | Hỏi sau task: "Moni nói gì?" → paraphrase đúng = pass |
| Tester có biết sửa AI khi sai không? | Quan sát: tester có bấm nút sửa category không? |
| Tester có tin tưởng mức độ cảnh báo không? | Hỏi sau task: "Bạn có lo lắng không?" → Likert 1-5 |

---

## Bảng ghi kết quả

| Tester | Task 1 | Task 2 | Task 3 | Task 4 | Ghi chú |
|---|---|---|---|---|---|
| Tester 1 | | | | | |
| Tester 2 | | | | | |
| Tester 3 | | | | | |
| Tester 4 | | | | | |
| Tester 5 | | | | | |

---

## Findings (sau khi test)

1. (Điền sau khi test xong)
2. 
3. 

---

## Design changes sau UX test

| Finding | Thay đổi thiết kế |
|---|---|
| (Ví dụ: User không thấy nút "Hỏi Moni") | (Ví dụ: Đổi màu nút, tăng kích thước, thêm animation) |
| | |
| | |
