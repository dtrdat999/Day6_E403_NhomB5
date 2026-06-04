# Thin SPEC — Moni Tài Chính

## 1. Track, product/app và user

**Track:** D — Personal Finance  
**Product/app thật:** MoMo  
**User cụ thể:** Sinh viên / người mới đi làm, dùng MoMo để thanh toán, chuyển tiền, mua dịch vụ, ăn uống/cafe, nhưng không theo dõi chi tiêu đều đặn. Họ thường thấy "tiền đi đâu mất" nhưng phải tự đọc từng dòng giao dịch.  
**Nhóm có phải user thật không?** Có phần tương đồng — nhóm cũng dùng ví điện tử hằng ngày. Tuy nhiên nhóm chưa đại diện toàn bộ user MoMo (thiếu nhóm trung niên, buôn bán nhỏ).

## 2. Evidence summary

| Evidence | Nguồn | User/pain nói lên điều gì? | SPEC phải đổi gì? |
|---|---|---|---|
| Lịch sử GD có tổng chi + category nhưng thiếu giải thích | Self-use | User thấy con số nhưng không hiểu vì sao chi tiêu tăng | Thêm AI giải thích insight theo category |
| Có giao dịch "Chưa phân loại" | Self-use | AI phân loại chưa cover hết → user mất trust | Thêm low-confidence path: hỏi lại user |
| Moni trả lời "Không tìm thấy" khi hỏi tự nhiên | Self-use | AI chưa hiểu ngữ cảnh / semantic category | Cần suggested prompts thay vì chatbox trống |
| Giao dịch Google không rõ mục đích | Self-use | Tên giao dịch từ payment provider không nói rõ dịch vụ | Cần giải thích + cho user sửa category |
| MoMo có nhiều banner quảng cáo, thông tin tài chính bị phân tán | Self-use | User khó tìm insight tài chính giữa rừng ưu đãi | Cần AI action layer tập trung vào spending insight |

## 3. Pain statement

```text
User trẻ dùng MoMo đang gặp khó khi xem lại lịch sử giao dịch,
vì các giao dịch hiển thị rời rạc, có khoản chưa phân loại hoặc phân loại chưa đúng,
dẫn tới việc user không hiểu vì sao tháng này chi tiêu tăng,
khoản nào cần kiểm tra, và khoản nào nên được nhắc thanh toán.
Bằng chứng chính là screenshot lịch sử GD có khoản "Chưa phân loại"
và Moni hiện tại trả lời "Không tìm thấy" khi hỏi ngữ cảnh tự nhiên.
```

## 4. Build slice

```text
Cho user đang xem lịch sử giao dịch MoMo,
prototype dùng Moni AI để phân tích chi tiêu tháng,
phân loại giao dịch, phát hiện khoản bất thường,
giải thích giao dịch/phí và gợi ý nhắc thanh toán.
Khi giao dịch mơ hồ hoặc AI không chắc,
AI không tự quyết mà hỏi lại user hoặc cho user sửa.
```

## 5. Auto/Aug decision

- [x] **Augmentation:** AI gợi ý/draft/phân loại, user quyết cuối.
- [ ] Conditional automation
- [ ] Automation

**Lý do chọn:** Tài chính cá nhân là lĩnh vực nhạy cảm. AI không nên tự kết luận giao dịch là gian lận (gây hoảng loạn) hoặc tự xác nhận an toàn (gây chủ quan). User phải là người quyết định cuối cùng.  
**Human role:** reviewer / decider / corrector

## 6. Four paths

| Path | Prototype phải thể hiện gì? |
|---|---|
| Happy | User bấm "Phân tích tháng này", Moni phân tích đúng: tổng chi, khoản lớn nhất, giao dịch chưa phân loại, gợi ý hành động. |
| Low-confidence | Moni không chắc giao dịch "Chuyển tiền đến Nguyễn Đông Anh" thuộc category nào → hỏi user chọn: Ăn uống / Chuyển khoản cá nhân / Trả nợ. |
| Failure | Moni ban đầu phân loại "Thanh toán Google" là "Giải trí" nhưng thực chất có thể là công cụ học tập/làm việc. Moni hiển thị confidence = Trung bình. |
| Correction | User bấm "Đổi sang Học tập / Công cụ" → Moni cập nhật lại báo cáo chi tiêu, thông báo thay đổi rõ ràng, ghi nhớ cho lần sau. |

## 7. Failure mode nguy hiểm nhất

```text
Nếu user hỏi "giao dịch này có lạ không?",
AI có thể kết luận sai rằng giao dịch an toàn hoặc gian lận,
hậu quả là user chủ quan (bỏ qua rủi ro thật) hoặc hoảng loạn (khóa thẻ khi không cần).
Prototype sẽ xử lý bằng: không khẳng định tuyệt đối,
hiển thị risk level dạng "Cần kiểm tra" thay vì "Gian lận",
gợi ý kiểm tra lại biên lai/lịch sử đăng ký,
và để user liên hệ hỗ trợ nếu cần.
Owner kiểm thử path này là [tên thành viên phụ trách Test].
```

## 8. Owner plan cho sáng Day 06

 Thành viên | Việc phụ trách | Bằng chứng cần có trong repo |
|---|---|---|
| Thân Văn Hoàng | Research / evidence |  |
| Đặng TRầnĐạt | SPEC |  |
|  | Prototype |  |
|  | Test / failure path |  |
|  | Demo script / repo |  |
