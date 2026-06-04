# Toolkit — Từ Evidence Đến Build Slice (Moni Tài Chính)

Dùng để đúc rút bằng chứng thực tế (evidence) thành thiết kế sản phẩm cụ thể và chốt một build slice đủ nhỏ để demo xuất sắc trong 3-5 phút cho Day 06.

---

## 1. Gom Evidence Thành Cụm (Clustering)
Chúng tôi không gom bằng chứng theo tính năng, mà gom theo trải nghiệm thực tế và nỗi đau (pain point) của người dùng ví MoMo:

* **Cụm 1: Bị ngợp thông tin quảng cáo (Cognitive Overload):**
  * Trang chủ MoMo có quá nhiều banner quảng cáo (Ví trả sau, vay nhanh, lắc xì, hoàn tiền) che mất số liệu chi tiêu.
  * User muốn quản lý tài chính phải thao tác qua nhiều bước phức tạp.
* **Cụm 2: Số liệu khô khan không có giải thích (Data without Insights):**
  * MoMo có mục "Tổng quan tháng" hiển thị tổng chi và so sánh cùng kỳ, nhưng chỉ là con số tĩnh (ví dụ: "Tổng chi 271.667đ, tăng ↑271.667đ so với cùng kỳ").
  * User thấy chi tiêu tăng nhưng không hiểu cụ thể vì sao tăng (là do ăn uống tăng hay do một giao dịch lớn đột xuất như thanh toán Google).
* **Cụm 3: Các giao dịch mập mờ, thiếu phân loại (The "Unclassified" Black Box):**
  * Các khoản chuyển khoản cá nhân (chia tiền ăn, trả nợ) bị gán "Chưa phân loại" — việc không tự gán tùy ý là hợp lý, nhưng MoMo dừng ở đó và không chủ động gợi ý giúp user phân loại tiếp (Ăn uống? Trả nợ? Cá nhân?), nên khoản đó cứ bị bỏ trống mãi.
  * Giao dịch dịch vụ trực tuyến chỉ ghi tên chung chung ("Thanh toán Google") và bị gán nhầm vào "Giải trí" dù thực tế có thể là công cụ làm việc/học tập, làm sai lệch báo cáo tài chính.

---

## 2. Viết Insight
Dựa trên các cụm bằng chứng trên, nhóm đúc rút được insight cốt lõi:
```text
Người dùng trẻ (sinh viên/người mới đi làm) không chỉ cần một biểu đồ thống kê số liệu chi tiêu tĩnh.
Họ thực sự cần một trợ lý có khả năng giải thích bằng ngôn ngữ tự nhiên về lý do biến động dòng tiền,
đồng thời cung cấp phương thức chỉnh sửa cực kỳ đơn giản khi AI phân loại sai lệch,
bởi vì họ chỉ có cảm giác làm chủ tài chính khi chính họ là người quyết định phân loại cuối cùng.
```

---

## 3. Viết Opportunity (Cơ hội sản phẩm)
```text
Cơ hội là sử dụng AI để xây dựng một Action Layer tích hợp trực tiếp vào lịch sử giao dịch (Moni AI),
giúp tự động trích xuất thông tin, cảnh báo rủi ro lạ, đề xuất nhắc nhở thanh toán hóa đơn định kỳ,
nhưng luôn giữ vai trò hỗ trợ (Augmentation) - cho phép user xác nhận hoặc sửa đổi danh mục chỉ bằng 1-click.
```

---

## 4. Đánh Giá Build Slice (5 Tiêu Chí Thành Công)

Chúng tôi đánh giá phạm vi xây dựng (build slice) hiện tại qua 5 câu hỏi để đảm bảo tính khả thi và hiệu quả:

| Câu hỏi kiểm thử | Trạng thái | Chi tiết đối chiếu với Prototype |
|---|---|---|
| **User cụ thể chưa?** | [x] Đạt | Hoàng, sinh viên năm 3 dùng MoMo hàng ngày, cần kiểm soát dòng tiền cuối tháng. |
| **Task đủ hẹp chưa?** | [x] Đạt | Demo tập trung vào đúng một cuộc đối thoại ngắn qua chatbot Moni giải quyết 4 giao dịch tiêu biểu. |
| **AI decision rõ chưa?** | [x] Đạt | AI hỗ trợ phân tích chi tiêu, gợi ý phân loại khoản Nguyễn Đông Anh và cảnh báo khoản Google. |
| **Failure path rõ chưa?** | [x] Đạt | Có case AI phân loại sai khoản Google là "Giải trí" và user sửa lại thành "Học tập / Công cụ". |
| **Có evidence không?** | [x] Đạt | Có 4 bằng chứng từ trải nghiệm thực tế (Self-use) kèm screenshot và khảo sát nhanh 4 người dùng thực tế. |

---

## 5. Quyết Định Scope & Hướng Đi
* **Tình huống:** Ban đầu nhóm định làm một ứng dụng quản lý tài chính độc lập hoặc chatbot tự do (free-text) hỗ trợ tất cả các câu hỏi của user.
* **Quyết định cắt scope:** Cắt giảm toàn bộ tính năng nhập liệu tự do và kết nối ngân hàng thật. Tập trung 100% vào việc giả lập **AI Action Layer ngay trên giao diện MoMo** với các Suggested Prompt Chips để dẫn dắt user đi qua đúng 4 paths nghiệp vụ trong 3 phút thuyết trình.
* **Lý do:** Giảm thiểu rủi ro AI hiểu sai câu hỏi tự do trong lúc demo trực tiếp, đồng thời làm nổi bật được cơ chế tương tác Augmentation (AI gợi ý - User quyết định).

---

## 6. Câu Chốt Định Hướng (Synthesis Statement)
Dựa trên **bằng chứng về sự mập mờ trong lịch sử giao dịch MoMo và nhu cầu hiểu sâu về chi tiêu**, nhóm sẽ xây dựng **prototype AI Action Layer dưới dạng chatbot Moni**, dành cho **sinh viên và người mới đi làm**, để giải quyết **pain point "tiền đi đâu mất cuối tháng"** bằng cách **giúp AI tự phân tích, gợi ý phân loại và nhắc thanh toán định kỳ**, và sẽ test failure path **khi AI phân loại sai khoản thanh toán Google và cách user chỉnh sửa lại báo cáo tài chính (Correction Loop)**.

---

## 7. Backlog (Không xây dựng trong Day 06)
Các tính năng sau sẽ được đưa vào hàng đợi phát triển sau buổi demo:
1. **Real-time API Sync:** Tự động đồng bộ giao dịch từ các ngân hàng và ví điện tử khác qua API bảo mật.
2. **Auto-payment (Thanh toán tự động):** Tự động trừ tiền thanh toán hóa đơn khi đến ngày nhắc nhở nếu user bật tính năng auto-pay.
3. **Voice-guided financial assistant:** Trợ lý ảo phản hồi bằng giọng nói tự nhiên thay vì chỉ hiển thị text và cards.
4. **Predictive Budgeting:** AI dự báo số dư ví vào cuối tháng dựa trên thói quen chi tiêu của các tuần trước.
