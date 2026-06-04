# Evidence Pack — Moni Tài Chính (Ví MoMo AI Spending Insight)

## 1. Nhóm và Track
* **Tên nhóm:** Nhóm 4
* **Track:** D — Personal Finance (Tài chính cá nhân)
* **Product/app đã chọn:** Ví MoMo
* **Build slice đang nghĩ:** AI Action Layer trên Lịch sử giao dịch MoMo giúp phân tích chi tiêu tháng, phân loại giao dịch mập mờ/chưa rõ mục đích, cảnh báo rủi ro và gợi ý nhắc lịch thanh toán hóa đơn.

---

## 2. Nhật Ký Tự Trải Nghiệm (Self-Use Evidence)
Nhóm tự mở app MoMo thực tế, sử dụng tài khoản cá nhân và ghi nhận lại các điểm gãy (pain points) trên giao diện hiện tại:

| Observation | Screenshot | Path liên quan | Điều học được |
|---|---|---|---|
| Màn hình Lịch sử GD hiển thị giao dịch "Thanh toán Google" -271.667đ bị MoMo tự gán nhãn "Giải trí", dù thực tế là mua Google Workspace để học tập/làm việc. Giao dịch "Chuyển tiền đến Nguyễn Đông Anh" -40.000đ thì bị gán "Chưa phân loại" — việc không tự gán tùy ý cho giao dịch cá nhân mập mờ là hợp lý, nhưng MoMo dừng ở đó và không gợi ý giúp user phân loại tiếp (Ăn uống? Trả nợ? Cá nhân?). | [Lịch sử GD - ảnh 1](./d248a1cd-d8d7-455e-be03-436dc0b931c0.jpg), [Lịch sử GD - ảnh 2](./bacb2e27-4b6f-4698-8274-7c5f308dca6e.jpg) | Failure Path + Low-confidence Path | Hai vấn đề khác nhau trên cùng một màn hình: (1) giao dịch Google bị gán sai danh mục → báo cáo cuối tháng sai lệch, (2) giao dịch chuyển khoản cá nhân bị bỏ trống mà không được gợi ý phân loại → user không có thói quen tự phân loại thủ công nên khoản đó cứ bị bỏ trống, dần dần mất kiểm soát dòng tiền. |
| Trang chủ MoMo chứa quá nhiều banner quảng cáo (Ví Trả Sau, Hoàn tiền 50%, Túi Thần Tài, sự kiện 6.6...) và các dịch vụ phụ, đẩy phần thông tin tài chính cá nhân xuống rất sâu. User phải cuộn nhiều lần mới thấy mục "Lịch sử GD". | [Trang chủ MoMo](./2db43d6e-5383-4b56-b18e-9fd9d3440f29.jpg) | Happy Path | Thông tin chi tiêu — thứ user cần nhất — bị chìm dưới quảng cáo. Cần một lối tắt hoặc Finance Card ngay đầu trang để user truy cập nhanh vào phân tích chi tiêu. |
| Chatbot Moni trên MoMo trả lời đúng tổng chi tiêu tháng (271.667đ, 1 giao dịch), nhưng nội dung trả về chỉ là tóm tắt con số. Không giải thích khoản nào đáng chú ý, khoản nào bị phân loại sai, hoặc so sánh với tháng trước ra sao. | [Moni phân tích tháng](./00261735-c465-47a8-b007-0f29fc7d3ea3.jpg) | Happy Path | Moni có khả năng tổng hợp số liệu nhưng thiếu lớp giải thích (explainable insight). User vẫn phải tự suy luận tại sao chi tiêu tăng/giảm. Cần bổ sung phân tích nguyên nhân bằng ngôn ngữ tự nhiên. |
| Khi hỏi Moni "tổng chi tiêu tháng này của mình là bao nhiêu" vào thời điểm đầu tháng (chưa phát sinh giao dịch), Moni trả lời "0đ — Bạn chưa phát sinh giao dịch nào". Câu trả lời đúng nhưng không gợi ý thêm hành động nào (xem tháng trước, đặt ngân sách...). | [Moni trả lời 0đ](./84dda259-a82b-4d67-807e-524c078be96f.jpg) | Happy Path | Khi không có dữ liệu, Moni dừng lại ở câu trả lời ngắn gọn mà không chủ động gợi ý bước tiếp theo. Trải nghiệm bị "chết" — user không biết làm gì tiếp. Cần bổ sung gợi ý hành động (suggested actions) cho cả trường hợp edge-case. |

---

## 3. Khảo Sát & Bằng Chứng Xã Hội (User / Review / Social Evidence)
Nhóm đã tiến hành phỏng vấn chéo nhanh 4 người dùng MoMo thuộc phân khúc sinh viên và người mới đi làm:

| Quote / review / observation | Nguồn | User là ai? | Pain/failure mode |
|---|---|---|---|
| *"Cuối tháng không bao giờ biết tiền đi đâu. Mở lịch sử giao dịch thì toàn tên người chuyển khoản chia tiền ăn, app không tự gán nhãn nên biểu đồ cuối tháng thiếu chính xác."* | Phỏng vấn trực tiếp | Khánh, 21 tuổi, Sinh viên năm 3 | Thiếu tính năng gợi ý phân loại tự động cho giao dịch cá nhân. |
| *"Nhiều lúc tài khoản bị trừ tiền Google mới nhớ ra là đến hạn dịch vụ. Muốn hủy đăng ký thì ngại tra cứu, giá mà app tự nhắc trước."* | Phỏng vấn trực tiếp | Nam, 20 tuổi, Sinh viên | Không phát hiện được các giao dịch định kỳ để nhắc nhở người dùng. |
| *"Tôi không thích AI tự động đổi tiền bạc của mình mà không hỏi trước. Nhiều lúc nó đoán sai nhóm chi tiêu thì rất khó chịu."* | Phỏng vấn trực tiếp | Vy, 23 tuổi, Nhân viên bán hàng | Sợ rủi ro tự động hóa hoàn toàn (automation). Ủng hộ cơ chế AI gợi ý - người dùng quyết định (augmentation). |
| *"Tôi muốn biết chính xác tại sao tháng này chi tiêu của tôi lại tăng vọt chứ không chỉ muốn nhìn cái biểu đồ tròn vô hồn."* | Phỏng vấn trực tiếp | Trang, 22 tuổi, Designer | Thiếu lớp giải thích (explainable AI) bằng ngôn ngữ tự nhiên về xu hướng tài chính. |

> **Ghi chú về kiểm chứng:** Đây là khảo sát thực tế được nhóm thực hiện nhanh qua Google Meet/tin nhắn trước checkpoint M1 của Day 06 để củng cố giả định.

---

## 4. Phân Tích Đối Thủ (Competitor / Analog Evidence)

| App / mô hình tham khảo | Họ xử lý task này thế nào? | Pattern học được | Có áp dụng trong 1 ngày không? |
|---|---|---|---|
| **Money Lover** | Yêu cầu người dùng nhập tay từng giao dịch rồi tự chọn danh mục. | Phân loại chi tiêu rất chi tiết nhưng trải nghiệm nhập liệu tốn nhiều công sức. | **Không.** Chọn giải pháp đọc tự động giao dịch, chỉ hỏi lại user khi AI không chắc. |
| **Timo (Ngân hàng số)** | Tự động gán danh mục cho các giao dịch trong hệ thống. | Tự động phân loại nhanh nhưng thiếu phần giải thích xu hướng tài chính. | **Có.** Áp dụng cơ chế gán nhãn tự động kết hợp với conversational UI để giải thích ngữ cảnh chi tiết. |

---

## 5. Từ Bằng Chứng Đến Thấu Hiểu (Evidence -> Insight)
```text
Bằng chứng nổi bật nhất:
Trên cùng một màn hình Lịch sử GD, giao dịch "Thanh toán Google" bị MoMo gán nhầm vào "Giải trí"
(thực chất là công cụ làm việc), trong khi giao dịch "Chuyển tiền đến Nguyễn Đông Anh" bị để trống
danh mục ("Chưa phân loại"). Việc không tự gán tùy ý cho giao dịch cá nhân là hợp lý, nhưng MoMo
không chủ động gợi ý giúp user phân loại tiếp nên khoản đó cứ bị bỏ trống mãi.
Ngoài ra, Moni chatbot chỉ trả lời con số tổng chi mà không giải thích khoản nào đáng chú ý.

Insight:
Người dùng không chỉ cần nhìn số liệu tổng quan. Họ cần hiểu lý do chi tiêu biến động và có cảm giác
kiểm soát (control) thông qua việc dễ dàng chỉnh sửa lại phân loại của AI khi AI gán sai.

Opportunity:
AI có thể giúp bằng cách tự động gán nhãn nháp kèm mức độ tự tin (confidence level), giải thích nguyên
nhân biến động chi tiêu bằng ngôn ngữ tự nhiên, và đưa ra nút hành động chỉnh sửa nhanh (1-click correction)
trên chatbot khi cần.
```

---

## 6. Bằng Chứng Làm Thay Đổi Thiết Kế (Evidence-Driven SPEC Changes)
* [ ] Đổi user chính.
* [ ] Đổi pain statement.
* [x] Đổi build slice.
* [x] Đổi Auto/Aug decision.
* [x] Đổi 4 paths.
* [ ] Đổi failure mode.
* [ ] Đổi owner/test plan.

**Ghi rõ các thay đổi quan trọng:**
```text
Trước evidence:
Nhóm định làm một chatbot tài chính hỏi đáp tự do (free-text chat), AI tự động gán danh mục
cho mọi giao dịch một cách im lặng (automation).

Sau evidence:
Nhóm đổi thành mô hình AI Action Layer trên màn hình lịch sử giao dịch. Bổ sung các Suggested Chips
để dẫn dắt user qua các kịch bản chính và chuyển từ Automation sang Augmentation (AI chỉ gắn nhãn nháp
cảnh báo và hiển thị nút hành động để user xác nhận hoặc sửa lại).

Lý do:
Bằng chứng tự dùng và phỏng vấn người dùng cho thấy user sợ AI tự quyết định sai về tài chính của họ,
đồng thời chatbot tự do rất dễ bị gãy (fail) khi nhận câu hỏi tự nhiên mập mờ.
```
