interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: 'home', label: 'MoMo', icon: '/momo-logo.png' },
    { id: 'deals', label: 'Ưu đãi', icon: '/icon-deals.png' },
    { id: 'qr', label: 'Quét QR', icon: '/icon-qr.png', isCenter: true },
    { id: 'transactions', label: 'Lịch sử GD', icon: '/icon-history.png' },
    { id: 'profile', label: 'Tôi', icon: '/icon-profile.png' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''} ${item.isCenter ? 'qr-center' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          {item.isCenter ? (
            <div className="nav-icon"><img src={item.icon} alt={item.label} /></div>
          ) : (
            <span className="nav-icon"><img src={item.icon} alt={item.label} /></span>
          )}
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
