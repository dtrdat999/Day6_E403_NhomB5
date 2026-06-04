import React from 'react';

interface GuidePanelProps {
  screen: string;
}

const guideData: Record<string, { title: string; subtitle: string; content: React.ReactNode; icon: string }> = {
  home: {
    icon: '🏠',
    title: 'Trang chủ & Trung tâm Tài chính',
    subtitle: 'Mô phỏng siêu ứng dụng tích hợp AI',
    content: (
      <>
        <p>Đây là màn hình chính của ứng dụng được mô phỏng theo chuẩn Super App. Điểm nhấn là <strong>Trung Tâm Tài Chính</strong> — cửa ngõ kết nối người dùng với các tính năng phân tích dữ liệu AI.</p>
        <ul className="guide-list">
          <li><strong>Tổng hợp chi tiêu:</strong> Theo dõi nhanh tình trạng tài chính so với tháng trước.</li>
          <li><strong>Cảnh báo thông minh:</strong> AI tự động phát hiện các giao dịch bất thường hoặc "chưa phân loại".</li>
          <li><strong>Hành động:</strong> Dễ dàng gọi Chatbot Moni thông qua thanh tìm kiếm hoặc nút kêu gọi hành động (CTA) nổi bật.</li>
        </ul>
      </>
    )
  },
  transactions: {
    icon: '🕒',
    title: 'Quản lý Dòng tiền thông minh',
    subtitle: 'Tính năng cốt lõi của Moni',
    content: (
      <>
        <p>Lịch sử giao dịch không chỉ là danh sách thu chi đơn thuần. Hệ thống AI đã phân tích ngầm và dán nhãn (tag) cho từng khoản.</p>
        <ul className="guide-list">
          <li><strong>Độ tin cậy (Confidence):</strong> Các khoản chi được đánh giá theo độ tin cậy Thấp/Trung bình/Cao.</li>
          <li><strong>Giao dịch mập mờ:</strong> Các khoản chi chuyển khoản cá nhân hoặc tên thương hiệu không rõ ràng (như Google Play) sẽ được đánh dấu để người dùng chú ý.</li>
          <li><strong>Kêu gọi hành động:</strong> Gợi ý người dùng tương tác với Chatbot để làm rõ các khoản tiền này, tránh thất thoát hoặc báo cáo sai lệch.</li>
        </ul>
      </>
    )
  },
  chat: {
    icon: '🤖',
    title: 'Moni AI - Action Layer',
    subtitle: 'Hơn cả một Chatbot truyền thống',
    content: (
      <>
        <p>Moni không chỉ trả lời câu hỏi mà hoạt động như một <strong>Lớp Hành động (Action Layer)</strong> tương tác trực tiếp với dữ liệu của bạn.</p>
        <ul className="guide-list">
          <li><strong>Bảo mật riêng tư:</strong> Moni luôn hỏi xin phép quyền truy cập trước khi phân tích hoặc chỉnh sửa dữ liệu cá nhân của người dùng.</li>
          <li><strong>Sửa lỗi phân loại:</strong> Hướng dẫn và giải thích cho người dùng lý do dán nhãn sai (Explainable AI), sau đó cập nhật lại.</li>
          <li><strong>Nhắc nhở định kỳ:</strong> Tự động nhận diện các hóa đơn lặp lại hàng tháng (tiền điện, internet) và tạo lịch nhắc.</li>
        </ul>
        <div className="guide-highlight">
          Thử bấm vào các gợi ý bên dưới màn hình chat để xem AI tự động phân tích và xử lý giao dịch như thế nào!
        </div>
      </>
    )
  },
  default: {
    icon: '🧩',
    title: 'Các tính năng tiêu chuẩn',
    subtitle: 'Tính năng mô phỏng Super App',
    content: (
      <p>Đây là khu vực hiển thị các tính năng cơ bản, giúp hoàn thiện trải nghiệm mô phỏng của một siêu ứng dụng (ví dụ: quét mã QR, xem ưu đãi, thiết lập cá nhân). Bạn có thể quay lại <strong>Trang chủ</strong> hoặc <strong>Lịch sử GD</strong> để trải nghiệm tính năng AI.</p>
    )
  }
};

export default function GuidePanel({ screen }: GuidePanelProps) {
  const data = guideData[screen] || guideData.default;

  return (
    <div className="guide-panel-container">
      <div className="guide-header">
        <div className="guide-icon-wrapper">
          <span className="guide-icon">{data.icon}</span>
        </div>
        <div>
          <h2 className="guide-title">{data.title}</h2>
          <div className="guide-subtitle">{data.subtitle}</div>
        </div>
      </div>
      <div className="guide-content-wrapper">
        <div className="guide-content">
          {data.content}
        </div>
      </div>
      
      <div className="guide-footer">
        <div className="momo-branding">
          <img src="/momo-logo.png" alt="MoMo" className="footer-logo" />
          <span>Moni AI Insight Prototype</span>
        </div>
      </div>
    </div>
  );
}
