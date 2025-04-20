import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KYCForm = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
      setError('⚠️ Invalid Aadhaar number. Must be a 12-digit number.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/kyc/`, // ✅ Corrected endpoint
        { aadhaar_number: aadhaarNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500); // auto redirect after 1.5s
    } catch (error: any) {
      setError(
        error?.response?.data?.detail || '❌ Error verifying KYC. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 KYC Verification</h2>

        {success ? (
          <p className="text-green-600 text-center font-medium">
            ✅ KYC verified successfully! Redirecting...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="Enter 12-digit Aadhaar Number"
                maxLength={12}
                className="w-full px-4 py-2 border rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify KYC'}
            </button>
          </form>
        )}

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default KYCForm;
