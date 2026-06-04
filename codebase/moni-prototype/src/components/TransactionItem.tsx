import { Transaction, formatCurrency } from '../data/transactions';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.amount > 0;

  return (
    <div className="transaction-item">
      <div className="tx-icon">{transaction.icon}</div>
      <div className="tx-info">
        <div className="tx-name">{transaction.name}</div>
        <div className="tx-meta">
          <span className="tx-date">{transaction.date} • {transaction.time}</span>
          {transaction.confidence !== 'high' && (
            <span className={`confidence-badge confidence-${transaction.confidence}`}>
              {transaction.confidence === 'medium' ? '⚠️ Chưa chắc' : '❓ Chưa phân loại'}
            </span>
          )}
          {transaction.isRecurring && (
            <span className="confidence-badge" style={{ background: '#dbeafe', color: '#1e40af' }}>
              🔄 Định kỳ
            </span>
          )}
        </div>
        {transaction.description && (
          <div className="tx-date" style={{ marginTop: 2, fontSize: 10, color: '#9ca3af' }}>
            {transaction.description}
          </div>
        )}
      </div>
      <div className="tx-right">
        <span className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
        <span className="tx-category-badge">{transaction.category}</span>
      </div>
    </div>
  );
}
