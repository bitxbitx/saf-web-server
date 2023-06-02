const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../models/ecom/order.model');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductVariant = require('../../models/ecom/productVariant.model');

const calculateOrderAmount = (items, promoCode) => {
  total = 0;
  items.forEach(item => {
    const decoded = JSON.parse(item.productVariant);
    total += decoded.price * item.quantity;
  });
  if (promoCode) {
    const decoded = JSON.parse(promoCode)
    if (decoded) {
      // Check discount type
      if (decoded.discountType === 'percentage') {
        total = total - (total * (decoded.discountAmount / 100));
      } else {
        total = total - decoded.discountAmount;
      }
    }
  }

  return total * 100;
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
  const { paymentMethodId, items, currency, useStripeSdk, promoCode } = req.body;
  const orderAmount = calculateOrderAmount(items, promoCode);
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
      console.log("Confirming payment intent");
      intent = await stripe.paymentIntents.confirm(paymentIntentId);
      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
    }

    if (intent.status === 'succeeded') {
      try {
        const userId = req.userId;
        // Extract Product variant from items
        const orderItems = [];
        items.forEach(item => {
          const decoded = JSON.parse(item.productVariant);
          orderItems.push({
            "productVariant": decoded.id,
            quantity: item.quantity,
          });
        });
        const order = new Order({
          customer: userId,
          orderItems: orderItems,
          totalPrice: orderAmount,
        });
        await order.save();

        // Update Product Variant
        items.forEach(async item => {
          const decoded = JSON.parse(item.productVariant);
          const productVariant = await ProductVariant.findById(decoded.id).exec();
          productVariant.stock = productVariant.stock - item.quantity;
          productVariant.save();
        });

      } catch (error) {
        console.log("Error creating order", error);
      }
    }
    console.log("generateResponse(intent), intent", generateResponse(intent), intent);
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