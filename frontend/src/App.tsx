import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import ReceiveMoney from './pages/ReceiveMoney';
import TransactionHistory from './pages/TransactionHistory';
import KYCPage from './pages/KYCPage'; // 🔥 Import your KYC page
import KYCForm from './pages/KYCForn';
import Logout from './pages/Logout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/receive" element={<ReceiveMoney />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/kyc" element={<KYCForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/kyc" element={<KYCPage />} /> {/* 👈 Add KYC route here */}
      </Routes>
    </Router>
  );
};

export default App;
