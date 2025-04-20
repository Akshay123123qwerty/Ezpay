## 💸 EzPay – Digital Wallet System

EzPay is a modern digital wallet system built with **React.js** and **Django**, allowing users to:
- Complete KYC with Aadhaar
- Send & receive money instantly
- View real-time wallet balance
- Track transaction history securely

---
## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
---

## 🚀 Features

### 🔒 Aadhaar-based KYC Verification
- Secure KYC simulation that restricts access to wallet features until verification is completed.

### 🛡️ JWT Authentication
- User login and registration are secured using JWT (JSON Web Tokens).

### 💸 Send/Receive Money
- Users can send and receive money seamlessly after completing KYC verification.

### 🧾 Transaction History
- A clear and user-friendly history of transactions to keep track of all financial activity.

### 🔐 Protected Routes
- Certain routes (such as sending/receiving money) are only accessible after KYC verification.

---


## 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React.js + Tailwind CSS   |
| Backend     | Django + Django REST API  |
| Auth        | JWT (djangorestframework-simplejwt) |
| Database    | SQLite (for development)  |
| Deployment  | Render (Free Tier)        |

---

## ▶️ Usage

### Frontend
1. **Home Screen**: Displays the current wallet balance and KYC status.
2. **Complete KYC**: If KYC is incomplete, users can navigate to the KYC page.
3. **Send/Receive Money**: Users can send or receive money after KYC verification.
4. **Transaction History**: View a detailed list of past transactions.

### Backend API
- **Login/Register**: 
  - `POST /api/login/` for logging in with credentials.
  - `POST /api/register/` for user registration.
- **KYC Verification**:
  - `GET /api/kyc/status/` to check KYC status.
  - `POST /api/kyc/verify/` to simulate KYC verification.
- **Wallet Operations**:
  - `GET /api/wallet/balance/` to fetch the current balance.
  - `POST /api/wallet/send/` to send money (requires KYC).
  - `POST /api/wallet/receive/` to receive money (requires KYC).
- **Transaction History**:
  - `GET /api/wallet/transactions/` to fetch the list of transactions.

---


## 🔮 Future Enhancements

### 🧑‍💻 Real-Time Transactions
- Implement real-time transaction updates using WebSockets for instant notifications and updates.

### 🔐 Enhanced KYC
- Integrate actual Aadhaar-based KYC verification for real-world applications.

### 📱 Mobile App
- Build a mobile app (React Native or Flutter) to make EzPay accessible on smartphones.

### 🧑‍🤝‍🧑 User-to-User Transactions
- Enable peer-to-peer transfers where users can send funds to each other’s wallet IDs.

### 🛠️ Multi-Language Support
- Implement multi-language support for a more inclusive user experience.

---
## 📸 Demo
![image](https://github.com/user-attachments/assets/b7d80644-c65d-47f7-ade5-3c10a77b43e6)


