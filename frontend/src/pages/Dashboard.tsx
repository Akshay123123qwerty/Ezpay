import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import CheckKYCStatus from './CheckKYCStatus';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 relative">
      {/* Left Panel – Branding */}
      <div className="bg-blue-600 text-white flex flex-col justify-center items-center p-12 space-y-8">
        <h1 className="text-5xl font-bold">EzPay</h1>
        <p className="text-lg max-w-md text-center text-blue-100">
          Seamlessly manage your money. Check your balance, transfer funds, and
          track transactions—all in one secure app.
        </p>
        <ul className="text-blue-100 text-sm space-y-2 text-left list-disc list-inside max-w-md">
          <li>💰 Real-Time Wallet Balance</li>
          <li>🔐 Secure Aadhaar-based KYC</li>
          <li>💸 Instant Transfers</li>
          <li>📊 Easy Transaction Tracking</li>
        </ul>
      </div>

      {/* Right Panel – Dashboard */}
      <div className="relative flex flex-col justify-center items-center p-10 w-full">
        {/* Top Right Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          {!kycVerified && kycVerified !== null && (
            <button
              onClick={() => navigate("/kyc")}
              className="bg-gray-300 text-white px-4 py-2 rounded-xl hover:bg-yellow-500 transition"
            >
              📝 Complete KYC
            </button>
          )}
          <button
            onClick={() => navigate("/logout")}
            className="bg-gray-300 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            👋 Welcome back, {username || "User"}
          </h1>
          <p className="text-gray-600 mb-1">Your current wallet balance:</p>
          <h2 className="text-5xl font-semibold text-green-600 mb-6">
            ₹{balance !== null ? balance.toFixed(2) : "..."}
          </h2>

          <CheckKYCStatus onStatusChange={setKycVerified} />
          {kycVerified === false && (
            <p className="text-yellow-600 mt-2">
              ⚠️ Your KYC is pending. You cannot send or receive money.
            </p>
          )}
          {kycVerified && (
            <p className="text-green-600 mt-2">✅ KYC Verified!</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <button
              onClick={() => navigate("/send")}
              className="bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!kycVerified}
            >
              💸 Send Money
            </button>
            <button
              onClick={() => navigate("/receive")}
              className="bg-green-600 text-white py-3 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-50"
              disabled={!kycVerified}
            >
              📥 Receive Money
            </button>
            <button
              onClick={() => navigate("/transaction-history")}
              className="bg-purple-500 text-white py-2 rounded-xl shadow hover:bg-purple-600 transition"
            >
              🧾 History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
