const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const createPaymentIntent = asyncHandler(async (req, res) => {
//   const { cartItems, shippingAddress } = req.body;
//   const { user } = req;

//   // Calculate order amount
//   const amount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency: 'usd',
//     metadata: { integration_check: 'accept_a_payment' },
//     receipt_email: user.email,
//     shipping: {
//       name: user.name,
//       address: {
//         line1: shippingAddress.address,
//         city: shippingAddress.city,
//         postal_code: shippingAddress.postalCode,
//         state: shippingAddress.country,
//         country: shippingAddress.country,
//       },
//     },
//   });

//   res.json({ clientSecret: paymentIntent.client_secret });
// }
// );

// module.exports = { createPaymentIntent };

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;

  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  // return items.reduce((acc, item) => acc + item.price * item.quantity, 0);

};

const generateResponse = intent => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  switch (intent.status) {
    case 'requires_action':
      return {
        requiresAction: true,
        clientSecret: intent.client_secret,
        status: intent.status
      };
    case 'requires_source_action':
      // Card requires authentication
      return {
        requiresAction: true,
        clientSecret: intent.client_secret,
        status: intent.status
      };
    case 'succeeded':
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log("💰 Payment received!");
      return { clientSecret: intent.client_secret, status: intent.status };
    case 'requires_payment_method':
      console.log("💰 Payment requires_payment_method!");
      return { 'error': ' Your card was denied, please provide a new payment method' };
    default:
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status',
        status: intent.status
      };
  }
}

const stripePayEndpointMethodId = asyncHandler(async (req, res) => {
  const { paymentMethodId, items, currency, useStripeSdk } = req.body;

  const orderAmount = calculateOrderAmount(items);

  try {
    let intent;
    if (paymentMethodId) {
      // Create new PaymentIntent with a PaymentMethod ID from the client.
      intent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: currency,
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        use_stripe_sdk: useStripeSdk,
      });
      // After create, if the PaymentIntent's status is succeeded, fulfill the order.
    } else if (paymentIntentId) {
      // Confirm the PaymentIntent to finalize payment after handling a required action
      // on the client.
      intent = await stripe.paymentIntents.confirm(paymentIntentId);
      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
    }
    res.send(generateResponse(intent));
  }
  catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, etc
    // See https://stripe.com/docs/declines/codes for more
    res.send({ error: e.message });
  }
});

const stripePayEndpointIntentId = asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  
  try {
    if (paymentIntentId) {
      // Confirm the PaymentIntent to finalize payment after handling a required action
      // on the client.
      const intent = await stripe.paymentIntents.confirm(paymentIntentId);
      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
      res.send(generateResponse(intent));
    }
    res.send({ error: 'Invalid PaymentIntent ID' });
  }
  catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, etc
    // See https://stripe.com/docs/declines/codes for more
    res.send({ error: e.message });
  }
});

module.exports = { stripePayEndpointMethodId, stripePayEndpointIntentId };