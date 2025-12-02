import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import React from "react";

// ---------------------------
// Types
// ---------------------------
interface Seat {
  row: number;
  col: number;
}

// interface UserInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
// }

interface Movie {
  title: string;
}

interface Show {
  theater_city: string;
  start_time: string;
  end_time: string;
}

interface CheckoutFormProps {
  // userInfo: UserInfo;
  seats: Seat[];
  movie: Movie;
  show: Show;
  totalPrice: number;
  onClose: () => void;
  // onConfirm: () => void;
  // returnUrl: string; // <-- add return URL for redirection after payment
}

// ---------------------------
// Component
// ---------------------------
export default function CheckoutForm({
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
      console.warn("Checkout is not ready:", checkoutState.type);
      return;
    } else if (checkoutState.type === "loading"){
      console.warn("Checkout is still loading");
        <div>Loading...</div>
      return;
    }

    const { checkout } = checkoutState as any;

    // Confirm checkout with return URL
    const result = await checkout.confirm();

    if (result.type === "error") {
      console.error("Payment error:", result.error.message);
      alert(result.error.message);
    } else {
       // optional callback for local UI update
      // Stripe will automatically redirect to return_url
    }
  };

  // ---------------------------
  // Render states
  // ---------------------------
  if (checkoutState.type === "loading") return <div>Loading payment form…</div>;
  if (checkoutState.type === "error")
    return <div>Error loading checkout: {checkoutState.error.message}</div>;

  // ---------------------------
  // Render form
  // ---------------------------
  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      {/* Booking Summary */}
      <div
        style={{
          marginBottom: 20,
          padding: 15,
          border: "1px solid #ccc",
          borderRadius: 6,
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

      {/* Stripe Payment Form */}
      <form onSubmit={handleSubmit}>
        <PaymentElement />

        <p style={{ marginTop: 10 }}>
          Use <strong>test@example.com</strong> when testing.
        </p>

        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#6772e5",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Pay Now
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 10,
            padding: "8px 16px",
            background: "#ccc",
            color: "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
            fontSize: "14px",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
