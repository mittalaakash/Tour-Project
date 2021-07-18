import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51JDnaySI0UnuWRRUOw6xhClPW7oQ3VQo24tu85ZzmtTJV1DwUZztCUMjp0BtX6EvZ3ApkGMBYpZpDzyxioBIqdBV002yeFBAqU',
);

export const bookTour = async tourId => {
  try {
    //get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    //create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
