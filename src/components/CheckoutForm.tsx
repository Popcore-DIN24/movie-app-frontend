import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import React from "react";

interface Seat {
  row: number;
  col: number;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface Movie {
  title: string;
}

interface Show {
  theater_city: string;
  start_time: string;
  end_time: string;
}

interface CheckoutFormProps {
  userInfo: UserInfo;
  seats: Seat[];
  movie: Movie;
  show: Show;
  totalPrice: number;
  onClose: () => void;
}

export default function CheckoutForm({
  userInfo,
  seats,
  movie,
  show,
  totalPrice,
  onClose,
}: CheckoutFormProps) {
  const checkoutState = useCheckout();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (checkoutState.type === "error") {
      alert("Payment system not ready.");
      return;
    }
    if (checkoutState.type === "loading") {
      alert("Payment form still loading...");
      return;
    }

    const { checkout } = checkoutState as any;

    const result = await checkout.confirm();

    if (result.type === "error") {
      alert(result.error.message);
    }
  };

  if (checkoutState.type === "loading") return <div>Loading payment form…</div>;
  if (checkoutState.type === "error")
    return <div>Error loading checkout: {checkoutState.error.message}</div>;

  return (
    <div style={{ maxWidth: 450, margin: "0 auto" }}>
      {/* =============== USER INFO BOX =============== */}
      <div
        style={{
          marginBottom: 20,
          padding: 15,
          borderRadius: 6,
          background: "#1a1a1a",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>Your Details</h2>

        <p><strong>First Name:</strong> {userInfo.firstName || "—"}</p>
        <p><strong>Last Name:</strong> {userInfo.lastName || "—"}</p>
        <p><strong>Email:</strong> {userInfo.email || "—"}</p>
      </div>

      {/* =============== BOOKING SUMMARY BOX =============== */}
      <div
        style={{
          marginBottom: 20,
          padding: 15,
          border: "1px solid #444",
          background: "#111",
          borderRadius: 6,
          color: "white",
        }}
      >
        <h2>Booking Summary</h2>

        <p>
          <strong>Movie:</strong> {movie.title}
        </p>

        <p>
          <strong>Showtime:</strong>{" "}
          {new Date(show.start_time).toLocaleDateString()}{" "}
          {new Date(show.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(show.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p>
          <strong>Seats:</strong>{" "}
          {seats.map((s) => `${String.fromCharCode(65 + s.row)}${s.col + 1}`).join(", ")}
        </p>

        <p>
          <strong>Total Price:</strong> £{totalPrice.toFixed(2)}
        </p>
      </div>

      {/* =============== STRIPE PAYMENT FORM =============== */}
      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <p style={{ marginTop: 10, color: "#ccc" }}>
          Use <strong>test@example.com</strong> for testing.
        </p>

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "#6772e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            width: "100%",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Pay Now
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 12,
            padding: "10px 20px",
            background: "#ccc",
            color: "#222",
            border: "none",
            borderRadius: 6,
            width: "100%",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
