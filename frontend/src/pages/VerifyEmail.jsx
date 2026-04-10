import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setMessage(data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed.');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <FiCheckCircle size={48} color="#22c55e" />
            <h2 style={{ marginTop: 12 }}>Email Verified!</h2>
            <p>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>Go to Login</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <FiXCircle size={48} color="#ef4444" />
            <h2 style={{ marginTop: 12 }}>Verification Failed</h2>
            <p>{message}</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>Register Again</Link>
          </>
        )}
      </div>
    </div>
  );
}
