# Product Internal Workflow — Moni AI Insight

Đây là luồng xử lý (workflow) bên trong hệ thống của Moni AI từ khi nhận dữ liệu giao dịch cho đến khi tương tác với User. Sơ đồ này thể hiện rõ kiến trúc **Augmentation** và cách hệ thống rẽ nhánh cho **4 Paths**.

```mermaid
flowchart TD
    %% Khởi tạo dữ liệu
    A([Dữ liệu giao dịch mới từ Cổng thanh toán]) --> B[Module Trích xuất\n(Làm sạch Tên, Số tiền)]
    
    %% AI Phân tích
    B --> C{AI Categorization Engine\n& Confidence Scoring}
    
    %% Phân loại theo độ tin cậy
    C -- Độ tin cậy CAO\n(VD: The Coffee House) --> D[Tự động gán Category]
    C -- Độ tin cậy TRUNG BÌNH\n(VD: Thanh toán Google) --> E[Gán Category dự đoán & Nhãn Medium]
    C -- Độ tin cậy THẤP\n(VD: CK cho cá nhân) --> F[Để trống Category & Nhãn Low]
    
    %% Kiểm tra bất thường
    D --> G{Anomaly / Recurring Engine\nPhát hiện bất thường}
    E --> G
    F --> G
    
    G -- Chi tiêu lớn đột biến --> H1[Cảnh báo: Cần kiểm tra]
    G -- Nhận diện gói cước định kỳ --> H2[Gợi ý: Đặt lịch nhắc nhở]
    G -- Bình thường --> H3[Cập nhật vào Báo cáo Tháng]
    
    %% Giao diện người dùng
    H1 --> UI((Hiển thị trên UI\nSuggested Prompt Chips))
    H2 --> UI
    H3 --> UI
    
    %% Tương tác người dùng
    UI -- User bấm chọn phân tích/kiểm tra --> I{Xử lý theo trạng thái giao dịch}
    
    I -- Giao dịch trống (Low-conf Path) --> J[AI hiển thị các nút dự đoán]
    J -- User bấm chọn phân loại --> K(Correction Loop: Ghi nhận DB & Huấn luyện lại model)
    
    I -- Giao dịch tạm (Failure Path) --> L[AI báo lý do phân loại tạm]
    L -- User xác nhận Sai --> M[User sửa Category đúng]
    M --> K
    
    I -- Giao dịch chuẩn (Happy Path) --> N[Báo cáo Insight chính xác]
    
    K --> UI
```

### 💡 Cách giải thích sơ đồ này khi thuyết trình:
1. **Confidence Scoring (Chấm điểm độ tự tin):** Hãy nhấn mạnh rằng điểm "ăn tiền" của sản phẩm là AI không chỉ phân loại, mà còn tự biết nó chắc chắn đến mức nào (High/Medium/Low). 
2. **Ngăn chặn rủi ro (Failure Mode Mitigation):** Nhờ có hệ thống Scoring, các giao dịch khó đoán (như Google/Apple Pay hoặc chuyển khoản cá nhân) sẽ không bị AI "nhét đại" vào một nhóm nào đó, mà sẽ kích hoạt cơ chế hỏi lại User.
3. **Correction Loop:** Khi User sửa một giao dịch (ví dụ đổi Google từ Giải trí sang Học tập), luồng data vòng lại hệ thống (Correction Loop) giúp AI học được sở thích của từng User cụ thể, phục vụ cho quá trình Personalization.
