import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWallet } from '../context/WalletContext';
import CheckKYCStatus from './CheckKYCStatus';

const SendMoney: React.FC = () => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const { setBalance } = useWallet();

  const getToken = (): string | null => localStorage.getItem('access_token');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();
      if (!token) {
        setError('You must be logged in to fetch users.');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/wallet/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsernames(response.data);
      } catch (err) {
        console.error('Failed to load users', err);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

 
  useEffect(() => {
    if (kycVerified === false) {
      navigate('/kyc');
    }
  }, [kycVerified, navigate]);

  const handleSend = async () => {
    setMessage('');
    setError('');
    setLoading(true);

    const token = getToken();
    if (!token) {
      setError('You must be logged in to send money.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/send_money/`,
        { receiver, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('✅ Transaction Successful!');
      setReceiver('');
      setAmount(0);
      setBalance(response.data.new_balance);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.receiver) {
        setError(`Receiver Error: ${err.response.data.receiver}`);
      } else {
        setError('❌ Transaction Failed!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Send Money</h2>

        <CheckKYCStatus onStatusChange={setKycVerified} />

        {kycVerified === null && (
          <p className="text-center text-gray-500 mb-4">Checking KYC status...</p>
        )}

        {kycVerified && (
          <>
            {message && <p className="text-green-600 text-center mb-4">{message}</p>}
            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block mb-1 font-medium">Receiver Username</label>
              <select
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                required
              >
                <option value="">Select a user</option>
                {usernames.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="Enter amount"
                min={1}
                required
              />
            </div>

            <button
              onClick={handleSend}
              className={`w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </>
        )}

        <button
          onClick={() => navigate('/transaction-history')}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          📜 View Transaction History
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
