import  { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

interface SessionData {
    id: string;
    payment_status: string;
    amount_total: number;
    currency: string;
    customer_email: string;
}
const SuccessfulPage = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<SessionData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:3000/session-status?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setSession(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) return <div>Loading payment status...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>No session found</div>;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', color: 'black', borderRadius: '8px' }}>
        <h3>Order Details:</h3>
        <p><strong>Session ID:</strong> {session.id}</p>
        <p><strong>Payment Status:</strong> {session.payment_status}</p>
        <p><strong>Amount:</strong> {(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
        <p><strong>Customer Email:</strong> {session.customer_email}</p>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Back to Start
      </button>
    </div>
  );
};

export default SuccessfulPage;