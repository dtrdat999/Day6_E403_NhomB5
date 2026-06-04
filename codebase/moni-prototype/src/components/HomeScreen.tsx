import { useState } from 'react';
import { Transaction, calculateTotalExpense, formatCurrency, MOCK_PREVIOUS_MONTH_TOTAL, getUnclassifiedTransactions } from '../data/transactions';

interface HomeScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ transactions, onNavigate }: HomeScreenProps) {
  const [showBalance, setShowBalance] = useState(true);
  const totalExpense = calculateTotalExpense(transactions);
  const unclassified = getUnclassifiedTransactions(transactions);
  const diff = totalExpense - MOCK_PREVIOUS_MONTH_TOTAL;
  const diffPercent = Math.round((diff / MOCK_PREVIOUS_MONTH_TOTAL) * 100);

  return (
    <div className="screen home-screen">
      {/* Header */}
      <div className="home-header">
        <div className="header-top">
          <div className="header-greeting">
            <img src="/momo-logo.png" alt="MoMo" className="momo-logo" />
            <span className="header-title">MoMo</span>
          </div>
          <div className="header-actions">
            <button className="header-action-btn">🔔</button>
            <button className="header-action-btn" onClick={() => onNavigate('chat')}>💬</button>
          </div>
        </div>
        <div className="search-bar" onClick={() => onNavigate('chat')}>
          <span className="search-icon">🔍</span>
          <span className="search-text">Hỏi và tìm kiếm bất cứ điều gì</span>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="wallet-card">
        <div className="wallet-top">
          <span className="wallet-label">Ví MoMo</span>
        </div>
        <div className="wallet-balance-row">
          <span className={`wallet-balance ${!showBalance ? 'hidden' : ''}`}>
            {showBalance ? '12.100đ' : '••••••'}
          </span>
          <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? '👁️' : '🙈'}
          </button>
        </div>
        <div className="wallet-note">Số dư mô phỏng — Academic Prototype</div>
      </div>

      {/* Service Shortcuts */}
      <div className="shortcuts">
        <div className="shortcut-item">
          <div className="shortcut-icon">💳</div>
          <span>Nạp/Rút</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">💸</div>
          <span>Nhận tiền</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">📱</div>
          <span>QR Thanh toán</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">🔧</div>
          <span>Ví tiện ích</span>
        </div>
      </div>

      {/* Finance Center Card — Điểm nhấn AI */}
      <div className="finance-card" onClick={() => onNavigate('transactions')}>
        <div className="finance-card-header">
          <span className="finance-icon">✨</span>
          <span className="finance-title">Trung Tâm Tài Chính của bạn</span>
          <span className="finance-arrow">›</span>
        </div>
        <div className="finance-body">
          <div className="finance-stat">
            <span className="stat-label">Chi tiêu tháng 6</span>
            <span className="stat-value">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="finance-stat">
            <span className="stat-label">So với cùng kỳ</span>
            <span className="stat-label" style={{ color: diff > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
              {diff > 0 ? '↑' : '↓'} {Math.abs(diffPercent)}%
            </span>
          </div>
          {unclassified.length > 0 && (
            <div className="finance-alert">
              <span className="alert-dot" />
              Moni phát hiện {unclassified.length} giao dịch cần kiểm tra
            </div>
          )}
          <button
            className="moni-cta"
            onClick={(e) => { e.stopPropagation(); onNavigate('chat'); }}
          >
            🤖 Hỏi Moni — Trợ lý tài chính AI
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="shortcuts">
        <div className="shortcut-item">
          <div className="shortcut-icon">💰</div>
          <span>Chuyển tiền</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">🏦</div>
          <span>Chuyển tiền NH</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">📋</div>
          <span>Thanh toán HĐ</span>
        </div>
        <div className="shortcut-item">
          <div className="shortcut-icon">📲</div>
          <span>Nạp ĐT</span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <div className="promo-tag">Ưu đãi</div>
          <div className="promo-text">Giảm 50% khi thanh toán điện nước qua MoMo</div>
          <div className="promo-note">Banner mô phỏng — Academic Prototype</div>
        </div>
        <img src="/icon-deals.png" alt="Ưu đãi" className="promo-icon" />
      </div>
    </div>
  );
}
