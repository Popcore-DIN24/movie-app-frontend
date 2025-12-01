import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
import {loadStripe} from '@stripe/stripe-js';
import  {useMemo} from 'react';
import CheckoutForm from '../../components/CheckoutForm';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutPage() {
  // useMemo here is to ensure the promise is only created once
  const promise = useMemo(() => {
    return fetch('https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: 50,
        customer_email: "test@example.com",
        movieName: "Test Movie",
        quantity: 1,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('/create-checkout-session response', data);
        if (data.error) {
          throw new Error(data.error);
        }
        return data.client_secret;
      })
      .catch((error) => {
        console.error('Error creating checkout session:', error);
        throw error;
      });
  }, []);

  return (
    <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
      <CheckoutForm />
    </CheckoutProvider>
  );
}

export default CheckoutPage;