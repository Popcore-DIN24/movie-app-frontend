import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Seat {
  row: number;
  col: number;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract state sent from CinemaSeatSelection
  const { userInfo, selectedSeats, totalPrice, movie, show } = location.state || {};

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect back if any required data is missing
  useEffect(() => {
    if (!userInfo || !selectedSeats || !totalPrice || !movie || !show) {
      alert("Missing booking information. Redirecting to movie page.");
      navigate("/");
    }
  }, [userInfo, selectedSeats, totalPrice, movie, show, navigate]);

  // ========================================================
  // Fetch Stripe client_secret from backend
  // ========================================================
  useEffect(() => {
    if (!userInfo || !selectedSeats || !totalPrice || !movie || !show) return;

    const createSession = async () => {
      try {
        const res = await fetch(
          "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/create-checkout-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              price_amount: totalPrice,
              customer_email: userInfo.email,
              movieName: movie.title,
              quantity: selectedSeats.length,
              seats: selectedSeats,
              showtime_id: show.id,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create session");

        setClientSecret(data.client_secret);
      } catch (error: any) {
        console.error("Stripe session error:", error);
        alert("Failed to initialize payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createSession();
  }, [userInfo, selectedSeats, totalPrice, movie, show]);

  if (loading) return <div>Creating secure payment…</div>;
  if (!clientSecret) return <div>Failed to initialize payment session.</div>;

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm
        seats={selectedSeats}
        movie={movie}
        show={show}
        totalPrice={totalPrice}
        onClose={() => navigate(-1)}
      />
    </CheckoutProvider>
  );
}
