interface InsightCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: string;
  onClick?: () => void;
}

export default function InsightCard({ title, value, subtitle, icon, color, onClick }: InsightCardProps) {
  return (
    <div
      className="insight-card"
      style={color ? { borderLeft: `4px solid ${color}` } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div className="insight-icon">{icon}</div>
      <div className="insight-content">
        <div className="insight-title">{title}</div>
        <div className="insight-value">{value}</div>
        {subtitle && <div className="insight-subtitle">{subtitle}</div>}
      </div>
      {onClick && <div className="insight-arrow">›</div>}
    </div>
  );
}
