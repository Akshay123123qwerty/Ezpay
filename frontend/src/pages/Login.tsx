import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/login/`, 
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('API Response:', response.data);
       
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', response.data.username);
      console.log(localStorage.getItem('username'));

     
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        
        {/* Left Panel: Branding or Features */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-10 space-y-6">
          <h1 className="text-4xl font-bold">Welcome to EzPay 💸</h1>
          <p className="text-lg text-blue-100 text-center max-w-sm">
            Fast, secure and effortless digital wallet. 
            Send, receive & manage your money in one place.
          </p>
          <ul className="text-blue-100 list-disc list-inside text-sm text-left space-y-2">
            <li>✅ Instant Transfers</li>
            <li>🔐 Secure Aadhaar KYC</li>
            <li>📊 Transaction History</li>
            <li>⚡ Real-time Wallet Updates</li>
          </ul>
        </div>

        {/* Right Panel: Login Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-12 w-full"
        >
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2 text-center">EzPay</h1>
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
            Login to your account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="text-center mt-4 text-sm">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
