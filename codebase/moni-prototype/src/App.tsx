import { useEffect, useState } from 'react';
import { transactions as initialTransactions, Transaction } from './data/transactions';
import PhoneFrame from './components/PhoneFrame';
import HomeScreen from './components/HomeScreen';
import TransactionScreen from './components/TransactionScreen';
import MoniChat from './components/MoniChat';
import BottomNav from './components/BottomNav';
import GuidePanel from './components/GuidePanel';
import { apiRequest } from './lib/api';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [txData, setTxData] = useState<Transaction[]>(initialTransactions);

  useEffect(() => {
    let cancelled = false;

    apiRequest('/api/transactions/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: initialTransactions }),
    })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && Array.isArray(data.transactions)) {
          setTxData(data.transactions);
        }
      })
      .catch(error => {
        console.warn('Không sync được database backend, dùng dữ liệu local.', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const res = await apiRequest(`/api/transactions/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
      const data = await res.json();

      if (data.transaction) {
        setTxData(prev =>
          prev.map(t => (t.id === id ? { ...t, ...data.transaction } : t))
        );
        return data.transaction as Transaction;
      }
    } catch (error) {
      console.warn('Không lưu được phân loại vào backend. Không xác nhận thay đổi trên UI.', error);
      throw error;
    }

    throw new Error('Backend không trả về giao dịch đã lưu.');
  };

  const handleNavigate = (target: string) => {
    setScreen(target);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen transactions={txData} onNavigate={handleNavigate} />;
      case 'transactions':
        return <TransactionScreen transactions={txData} onNavigate={handleNavigate} />;
      case 'chat':
        return (
          <MoniChat
            transactions={txData}
            onUpdateTransaction={handleUpdateTransaction}
            onBack={() => setScreen('transactions')}
          />
        );
      default:
        return <HomeScreen transactions={txData} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="layout-wrapper">
      <div className="phone-section">
        <PhoneFrame>
          <div className="app-container">
            <div className="screen-area">
              {renderScreen()}
            </div>
            {screen !== 'chat' && (
              <BottomNav
                active={screen === 'home' ? 'home' : screen === 'transactions' ? 'transactions' : 'home'}
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </PhoneFrame>
      </div>
      <div className="guide-section">
        <GuidePanel screen={screen} />
      </div>
    </div>
  );
}

export default App;
