# Day06-E403-Monii

> **Track D - Personal Finance** · Ví MoMo AI Spending Insight

## Thành viên nhóm

| Mã học viên | Họ và tên |
|-------------|-----------|
| 2A202600662 | Đặng Trần Đạt |
| 2A202600582 | Thân Văn Hoàng |
| 2A202600703 | Phạm Quang Dũng |
| 2A202600666 | Hoàng Anh Thư |

## Mô tả ngắn sản phẩm

**Moni** là lớp AI hỗ trợ phân tích chi tiêu cho ví MoMo, giúp người dùng trẻ hiểu rõ dòng tiền hằng tháng thay vì chỉ xem lịch sử giao dịch rời rạc. Prototype tập trung vào các tình huống:

- Phân tích chi tiêu tháng bằng ngôn ngữ tự nhiên.
- Phân loại lại các giao dịch mập mờ như chuyển khoản cá nhân hoặc thanh toán Google.
- Cảnh báo giao dịch có dấu hiệu rủi ro.
- Gợi ý nhắc thanh toán định kỳ.
- Yêu cầu quyền truy cập trước khi đọc dữ liệu giao dịch.
- Lưu thay đổi phân loại vào backend database để lần hỏi sau lấy trạng thái mới nhất.
- Từ chối các câu hỏi ngoài phạm vi tài chính cá nhân như chính trị, giải toán, lập trình hoặc chủ đề nhạy cảm không liên quan.

Moni hoạt động theo mô hình **Augmentation**: AI đưa ra phân tích/gợi ý, người dùng là người xác nhận quyết định cuối cùng.

## Cấu trúc nộp bài

```
Day06-E403-Monii/
├── README.md        ← Danh sách thành viên (mã HV + họ tên) + mô tả ngắn sản phẩm
├── spec/            ← SPEC sản phẩm (xem hướng dẫn trong spec/)
└── codebase/        ← Toàn bộ code prototype (xem hướng dẫn trong codebase/)
```

Trong repo này:

- `spec/`: chứa thin spec, evidence pack, synthesis/decide toolkit, workflow và mockup.
- `codebase/moni-prototype/`: frontend prototype bằng React + TypeScript + Vite.
- `codebase/backend/`: backend Python API, AI agent và database runtime phục vụ phần chat/phân tích.

## Luồng demo chính

1. Mở Moni Chat.
2. Moni yêu cầu quyền truy cập dữ liệu giao dịch trước khi trả lời.
3. Người dùng bấm `Cho phép truy cập`.
4. Người dùng hỏi ví dụ: `phân loại giao dịch của Nguyễn Minh Anh`.
5. Moni hiển thị giao dịch, phân loại hiện tại, độ tin cậy và các nút đổi danh mục.
6. Khi người dùng đổi phân loại, backend lưu thay đổi vào database.
7. Nếu hỏi lại cùng giao dịch, Moni trả về phân loại mới nhất đã lưu.

Moni chỉ trả lời các vấn đề liên quan đến tài chính cá nhân, tài khoản, giao dịch, chi tiêu, hóa đơn, nhắc thanh toán và phân loại giao dịch. Với câu hỏi ngoài phạm vi, Moni sẽ từ chối và gợi ý người dùng dùng công cụ tìm kiếm hoặc trợ lý phù hợp hơn.

## Link xem prototype public

Sau khi GitHub Actions deploy xong, có thể xem giao diện prototype tại:

https://dtrdat999.github.io/Day6_E403_Moniii/

Link public này dùng để xem giao diện frontend. Các thao tác cần AI backend và lưu database sẽ chạy đầy đủ khi backend được chạy local hoặc được deploy public và cấu hình biến `VITE_API_BASE_URL` cho GitHub Pages.

## Cách chạy prototype

Chạy backend:

```bash
cd codebase/backend
pip install -r requirements.txt
python main.py
```

Giữ terminal backend này mở trong lúc demo.

Backend sẽ tự tạo file `codebase/backend/transaction_db.json` để lưu trạng thái phân loại giao dịch trong lúc demo. Nếu muốn reset dữ liệu về ban đầu, tắt backend rồi xóa file `transaction_db.json`; lần chạy sau backend sẽ sync lại từ dữ liệu mẫu frontend.

Nếu API cloud không khả dụng, backend sẽ tự trả lời bằng chế độ demo offline để prototype vẫn chạy được.

Chạy frontend:

```bash
cd codebase/moni-prototype
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

## API backend chính

- `POST /api/transactions/sync`: đồng bộ dữ liệu mẫu frontend vào database backend.
- `GET /api/transactions`: lấy danh sách giao dịch mới nhất đã lưu.
- `PATCH /api/transactions/{transaction_id}`: lưu thay đổi phân loại giao dịch.
- `POST /api/chat`: gửi hội thoại tới Moni AI; nếu API cloud lỗi, dùng fallback offline.

## Công cụ & API sử dụng

- **Frontend**: React 19 + TypeScript + Vite 8
- **Backend**: Python + FastAPI/Uvicorn
- **Database prototype**: JSON file runtime (`transaction_db.json`)
- **AI/API**: OpenRouter-compatible chat completion API
- **UI**: Custom CSS theo phong cách MoMo

## Phân công

| Thành viên | Vai trò |
|------------|---------|
| Thân Văn Hoàng | Research / evidence |
| Đặng Trần Đạt | SPEC & Prototype |
| Phạm Quang Dũng | Test / failure path |
| Hoàng Anh Thư | Demo script / repo |


---