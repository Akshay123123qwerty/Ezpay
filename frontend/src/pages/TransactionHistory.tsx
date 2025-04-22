import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/wallet/transaction_history/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          🧾 Transaction History
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2 custom-scroll">
            <ul className="space-y-4">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:shadow-md transition duration-200"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800">
                      {transaction.sender}
                    </span>
                    <span className="text-gray-400 text-sm">→</span>
                    <span className="font-medium text-gray-800">
                      {transaction.receiver}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ₹{transaction.amount} •{" "}
                    <span className="capitalize">{transaction.transaction_type}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {transaction.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
        >
          📜 Go to Dashboard
        </button>
      </div>

      {/* For custom scrollbar */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background-color: #d1d5db; /* Tailwind gray-300 */
            border-radius: 9999px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background-color: transparent;
          }
        `}
      </style>
    </div>
  );
};

export default TransactionHistory;
