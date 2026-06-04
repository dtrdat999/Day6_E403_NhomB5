# Thin SPEC — Moni Tài Chính (Ví MoMo AI Spending Insight)

## 1. Track, Product/App và User Đích
* **Track:** D — Personal Finance (Tài chính cá nhân)
* **Product/App thật:** Ví điện tử MoMo
* **User cụ thể:** Sinh viên và người mới đi làm (Young Professionals) thường dùng MoMo để thanh toán ăn uống, cafe, mua sắm trực tuyến và chuyển tiền hàng ngày. Họ có nhu cầu theo dõi chi tiêu nhưng gặp khó khăn khi phải đọc từng dòng giao dịch khô khan hoặc khi gặp những khoản thanh toán mập mờ từ nhà cung cấp dịch vụ (Google, Apple, viễn thông) hoặc các giao dịch chuyển khoản cá nhân không có ghi chú.
* **Nhóm có phải user thật không?** Có, tất cả thành viên trong nhóm đều ở độ tuổi từ 20 đến 25, sử dụng ví điện tử MoMo hàng ngày và có chung nỗi đau về việc khó kiểm soát dòng tiền chi tiêu.

---

## 2. Bảng Tổng Hợp Bằng Chứng (Evidence Summary)

| Bằng chứng (Evidence) | Nguồn (Source) | Ý nghĩa đối với User (Insight) | Điều chỉnh thiết kế (SPEC Changes) |
|---|---|---|---|
| Lịch sử giao dịch MoMo chỉ hiển thị các con số và danh mục khô khan, không có giải thích xu hướng. | Nhóm tự dùng (Self-use) | User thấy tổng chi tăng so với cùng kỳ nhưng không rõ lý do (do ăn uống tăng hay do một khoản lớn đột xuất). | Thêm tính năng **AI Phân tích chi tiêu tháng** giải thích lý do tăng/giảm bằng ngôn ngữ tự nhiên. |
| Giao dịch chỉ hiển thị tên chung chung "Thanh toán Google", dễ bị MoMo gán nhầm category. | Nhóm tự dùng (Self-use) | MoMo tự gán vào "Giải trí" nhưng có thể sai nếu đây là khoản mua Google Workspace/Drive phục vụ học tập/làm việc. | Thiết kế **Failure & Correction path**: Hiển thị độ tin cậy Medium, cho phép user đổi sang "Học tập / Công cụ". |
| Các khoản chuyển khoản cho bạn bè (ví dụ "Nguyễn Đông Anh") bị gán "Chưa phân loại" — việc không tự gán tùy ý cho giao dịch mập mờ là hợp lý, nhưng MoMo dừng ở đó và không gợi ý giúp user phân loại tiếp. | Nhóm tự dùng (Self-use) | User không có thói quen tự phân loại thủ công nên khoản đó cứ bị bỏ trống, dần dần mất kiểm soát dòng tiền cuối tháng. | Thiết kế **Low-confidence path**: AI chủ động hỏi lại user bằng các gợi ý nhanh (Ăn uống? Trả nợ? Cá nhân?) thay vì để trống im lặng. |
| Chatbot Moni trên MoMo trả lời đúng tổng chi tiêu (271.667đ) nhưng chỉ nêu con số, không giải thích khoản nào đáng chú ý, khoản nào bị phân loại sai. Khi đầu tháng chưa có giao dịch, Moni trả lời "0đ" rồi dừng lại, không gợi ý hành động tiếp. | Nhóm tự dùng (Self-use) | Moni có khả năng tổng hợp số liệu nhưng thiếu lớp giải thích (explainable insight) và thiếu gợi ý hành động khi không có dữ liệu. | Bổ sung **phân tích nguyên nhân** bằng ngôn ngữ tự nhiên và **Suggested Prompt Chips** để dẫn dắt user đến bước tiếp theo. |
| Trang chủ MoMo chứa quá nhiều quảng cáo và dịch vụ tài chính phụ, đẩy phần lịch sử chi tiêu xuống rất sâu. | Nhóm tự dùng (Self-use) | Người dùng cảm thấy phiền phức khi muốn xem nhanh tổng quan chi tiêu hiện tại. | Tạo một **Finance Center Card** tinh gọn ở trang chủ hiển thị tổng chi tiêu tháng 6 và nút bấm "Hỏi Moni" nổi bật. |

---

## 3. Phát Biểu Vấn Đề (Pain Statement)
```text
User trẻ dùng MoMo đang gặp khó khi xem lại lịch sử giao dịch, vì các giao dịch hiển thị rời rạc,
có khoản chưa phân loại hoặc phân loại chưa đúng (như giao dịch Google bị gán "Giải trí" dù thực tế
là công cụ làm việc, hoặc chuyển tiền cá nhân bị để trống danh mục mà không được gợi ý phân loại tiếp),
dẫn tới việc user không hiểu vì sao tháng này chi tiêu tăng, khoản nào cần kiểm tra, và khoản nào
nên được nhắc thanh toán. Bằng chứng chính: giao dịch "Chưa phân loại" trong lịch sử GD MoMo không được
MoMo gợi ý phân loại, và chatbot Moni chỉ trả lời con số tổng chi mà không giải thích nguyên nhân biến động.
```

---

## 4. Build Slice (Phạm Vi Xây Dựng Prototype)
```text
Cho user đang xem lịch sử giao dịch MoMo, prototype sẽ sử dụng Moni AI làm một "AI Action Layer"
để hỗ trợ phân tích chi tiêu tháng, phân loại lại các giao dịch mập mờ, cảnh báo rủi ro lạ và gợi ý
nhắc thanh toán định kỳ. Khi AI gặp dữ liệu không chắc chắn (chuyển khoản cá nhân) hoặc sai lệch
(Google), AI sẽ không tự quyết mà đưa ra gợi ý và giao quyền quyết định cuối cùng cho User (Augmentation).
```

---

## 5. Quyết Định Tự Động Hóa vs. Hỗ Trợ (Auto/Aug Decision)
* [x] **Augmentation (Hỗ trợ):** AI phân tích, đưa ra gợi ý/nhãn tin cậy, và user quyết định cuối cùng.
* [ ] **Conditional automation:** AI tự động xử lý trong một số trường hợp an toàn; chuyển đổi sang user khi mơ hồ.
* [ ] **Automation:** AI tự động thực hiện và cập nhật không cần xác nhận.

* **Lý do chọn:** Tài chính cá nhân là một lĩnh vực nhạy cảm. Việc AI tự động phân loại sai hoặc tự quyết định về tiền bạc có thể gây mất lòng tin nghiêm trọng. Bằng cách để AI gợi ý (Augment) và User làm người phê duyệt cuối cùng (Decider/Reviewer/Corrector), chúng ta tối ưu hóa được sự thuận tiện của AI đồng thời duy trì quyền kiểm soát an toàn của con người.
* **Vai trò của con người (Human Role):** **Reviewer** (Xem xét các cảnh báo), **Decider** (Lựa chọn phân loại khi AI hỏi), và **Corrector** (Sửa lại phân loại khi AI đoán sai).

---

## 6. Bốn Kịch Bản Demo (Four Paths)

| Path | Ý nghĩa nghiệp vụ | Kịch bản thể hiện trong Prototype |
|---|---|---|
| **Happy Path** | AI tự tin và phân loại đúng 100%. | User bấm chip **"Phân tích tháng này"** -> Moni trả về tổng chi tiêu, khoản lớn nhất (Google) và chỉ ra các điểm cần chú ý một cách chính xác. |
| **Low-confidence Path** | AI không chắc chắn về giao dịch mập mờ. | Giao dịch "Chuyển tiền đến Nguyễn Đông Anh" có độ tin cậy thấp. Moni hiển thị nhãn **"Chưa chắc"** -> User bấm chọn -> Moni hỏi lại: *"Bạn muốn phân loại vào Ăn uống, Cá nhân hay Trả nợ?"* để user tự quyết định. |
| **Failure Path** | AI đoán sai do thiếu ngữ cảnh cụ thể. | Giao dịch "Thanh toán Google" thực chất là Hoàng mua Google Workspace để học tập, nhưng AI mặc định phân loại vào **"Giải trí"** (với độ tự tin Trung bình). |
| **Correction Path** | User sửa lại AI và AI cập nhật dữ liệu. | User bấm nút **"Đổi sang Học tập / Công cụ"** -> Moni cập nhật báo cáo lập tức (Giảm chi phí Giải trí, tăng Học tập) và xác nhận sẽ ghi nhớ hành vi này của user cho lần sau. |

---

## 7. Kịch Bản Thất Bại Nguy Hiểm Nhất (Dangerous Failure Mode)
```text
Nếu user hỏi "giao dịch này có lạ không?", AI có thể kết luận sai rằng giao dịch hoàn toàn an toàn
(làm user bỏ qua rủi ro mất tiền thật) hoặc kết luận sai rằng đó là gian lận (làm user hoảng sợ và khóa thẻ).
Prototype sẽ xử lý bằng cách: Tuyệt đối không khẳng định 100% giao dịch là an toàn hay gian lận.
Chỉ hiển thị mức độ cảnh báo ở mức "Cần kiểm tra" (🟡) kèm theo lý do cụ thể (tên giao dịch mập mờ,
khoản chi lớn hơn bình thường) và gợi ý user đối chiếu với hóa đơn email/lịch sử đăng ký dịch vụ.
Thành viên phụ trách kiểm thử path này là Phạm Quang Dũng.
```

---

## 8. Kịch Bản Thuyết Trình & Phân Công (Owner Plan cho Day 06)

| Thành viên | Vai trò phụ trách | Bằng chứng cần có trong repo |
|---|---|---|
| **Thân Văn Hoàng** | Research / evidence | `evidence-pack.md`, các ảnh screenshot thực tế trong folder `02-group-spec/` |
| **Đặng Trần Đạt** | SPEC & Prototype | `thin-spec.md`, `synthesis-decide-toolkit.md` |
| **Phạm Quang Dũng** | Test / failure path | Kiểm thử 4 paths và ghi nhận kết quả |
| **Hoàng Anh Thư** | Demo script / repo | `README.md`, chuẩn bị kịch bản demo |
