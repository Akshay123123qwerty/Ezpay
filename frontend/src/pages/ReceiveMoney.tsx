import React, { useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const ReceiveMoney: React.FC = () => {
  const walletAddress = 'user_wallet_address_12345';
  const navigate = useNavigate();

  const { balance, refreshBalance } = useWallet(); 

   useEffect(() => {
     refreshBalance();
   }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Receive Money</h1>

        <div className="mb-6">
          <p className="text-lg text-gray-600">Scan this QR code to send money to your wallet:</p>
          <div className="flex justify-center mt-4">
            <QRCodeCanvas value={walletAddress} size={256} />
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-lg">Or use this address:</p>
          <p className="font-mono text-gray-700 mt-2">{walletAddress}</p>
        </div>

        {/* Optional display */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Your current balance: <span className="font-semibold text-green-600">₹ ₹{balance !== null ? balance.toFixed(2) : '...'}</span>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          📜 Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ReceiveMoney;
