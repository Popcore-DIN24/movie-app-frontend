import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import jsPDF from "jspdf";

interface Ticket {
  id: string;
  seat_number: string;
  qr_code: string;
  total_price: string;
  payment_status: string;
}

interface SessionData {
  id: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  metadata: any;
  line_items: any[];
  tickets: Ticket[];
}

const SuccessfulPage = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<SessionData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      async function fetchSession() {
        try {
          const res = await fetch(
            `https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/session-status?session_id=${sessionId}`
          );
          const data = await res.json();
          console.log("Session data:", data);
          if (!res.ok) {
            setError(data.error || "Failed to fetch session data");
          } else {
            setSession(data);
          }
        } catch (err) {
          setError("Failed to fetch session data");
        } finally {
          setLoading(false);
        }
      }
      fetchSession();
    }
  }, [sessionId]);

  //Generate Ticket PDF
  const generatePDF = () => {
    if (!session || !session.tickets) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Movie Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Email: ${session.customer_email}`, 20, 50);
    doc.text(`Payment Status: ${session.payment_status}`, 20, 60);

    // Add each ticket
    let y = 75;
    session.tickets.forEach((ticket, idx) => {
      doc.text(`Ticket #${idx + 1}`, 20, y);
      doc.text(`Seat: ${ticket.seat_number}`, 20, y + 10);
      doc.text(`Price: ${parseFloat(ticket.total_price).toFixed(2)} ${session.currency?.toUpperCase()}`, 20, y + 20);

      if (ticket.qr_code) {
        doc.addImage(ticket.qr_code, "PNG", 20, y + 25, 50, 50);
      }

      y += 80;
      if (y > 250) { 
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`tickets-${session.id}.pdf`);
  };

  if (loading) return <div>Loading payment status...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>No session found</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase!</p>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f0f8ff",
          color: "black",
          borderRadius: "8px",
        }}
      >
        <h3>Order Details:</h3>
        <p><strong>Payment Status:</strong> {session.payment_status}</p>
        <p>
          <strong>Amount:</strong>{" "}
          {(session.amount_total / 100).toFixed(2)}{" "}
          {session.currency?.toUpperCase()}
        </p>
        <p><strong>Customer Email:</strong> {session.customer_email}</p>

        <h4>Tickets:</h4>
        {session.tickets.map((ticket, idx) => (
          <div
            key={idx}
            style={{
              marginTop: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            <p><strong>Seat:</strong> {ticket.seat_number}</p>
            <p><strong>Price:</strong> {parseFloat(ticket.total_price).toFixed(2)} {session.currency?.toUpperCase()}</p>
            {ticket.qr_code && <img src={ticket.qr_code} alt="Ticket QR" style={{ width: "120px", marginTop: "5px" }} />}
          </div>
        ))}
      </div>

      <button
        onClick={generatePDF}
        style={{
          marginTop: "25px",
          padding: "12px 25px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Ticket Details (PDF)
      </button>

      <br />

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Back to Start
      </button>
    </div>
  );
};

export default SuccessfulPage;
