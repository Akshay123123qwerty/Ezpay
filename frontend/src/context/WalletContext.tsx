// src/context/WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface WalletContextType {
  balance: number;
  refreshBalance: () => void;
  setBalance: (value: number) => void;
}

const WalletContext = createContext<WalletContextType>({
  balance: 12000, // default balance
  refreshBalance: () => {},
  setBalance: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(12000); // Default ₹12,000

  const getToken = () => localStorage.getItem("access_token");

  const refreshBalance = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8000/wallet/balance/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to refresh balance", err);
    }
  };

  useEffect(() => {
    refreshBalance(); 
  }, []);

  return (
    <WalletContext.Provider value={{ balance, refreshBalance, setBalance }}>
      {children}
    </WalletContext.Provider>
  );
};
