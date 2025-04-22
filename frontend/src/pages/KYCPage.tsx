import React, { useState } from 'react';
import axios from 'axios';

const KYCPage = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem('access_token');

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/kyc/`,
        { aadhaar_number: aadhaar },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage(response.data.message);
      setError('');
    } catch (err: any) {
      console.error('KYC submission failed:', err);
      setError(err.response?.data?.aadhaar_number || 'KYC verification failed.');
      setMessage('');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="p-6 max-w-sm w-full border rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">KYC Verification</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            maxLength={12}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
        {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
        {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default KYCPage;
