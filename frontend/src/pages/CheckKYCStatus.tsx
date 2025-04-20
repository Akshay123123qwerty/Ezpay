import { useState, useEffect } from 'react';
import axios from 'axios';

interface CheckKYCStatusProps {
  onStatusChange: (status: boolean) => void;
}

const CheckKYCStatus: React.FC<CheckKYCStatusProps> = ({ onStatusChange }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/wallet/kyc_status/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((res) => {
        onStatusChange(res.data.kyc_verified);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching KYC status', err);
        onStatusChange(false);
        setLoading(false);
      });
  }, [onStatusChange]);

  if (loading) return <p className="text-gray-500">Checking KYC status...</p>;

  return null;
};

export default CheckKYCStatus;
