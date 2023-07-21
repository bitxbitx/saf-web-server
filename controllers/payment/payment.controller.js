const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../models/ecom/order.model');
const PromoCode = require('../../models/ecom/promoCode.model');
const ProductVariant = require('../../models/ecom/productVariant.model');
/**
 * @swagger
 * tags:
 *   name: Ecommerce
 *   description: Ecommerce payment management
 * components:
 *   schemas:
 *     PaymentMethodIdRequestBody:
 *       type: object
 *       properties:
 *         paymentMethodId:
 *           type: string
 *           example: "pm_card_visa" 
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productVariant:
 *                 type: string
 *                 example: "{\"_id\":\"product_variant_id\",\"price\":10}" 
 *               quantity:
 *                 type: number
 *                 example: 2
 *         currency:
 *           type: string
 *           example: "usd" 
 *         useStripeSdk:
 *           type: boolean
 *           example: true
 *         promoCode:
 *           type: string
 *           example: "{\"_id\":\"promo_code_id\",\"discountType\":\"percentage\",\"discountAmount\":10}" 
 *     PaymentIntentIdRequestBody:
 *       type: object
 *       properties:
 *         paymentIntentId:
 *           type: string
 *           example: "pi_12345" 
 */
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

/**
 * @swagger
 * /api/ecom/stripe-pay-method-id:
 *   post:
 *     summary: Create or confirm a PaymentIntent with a PaymentMethod ID
 *     tags: [Ecommerce]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethodIdRequestBody'
 *     responses:
 *       '200':
 *         description: PaymentIntent created or confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requiresAction:
 *                   type: boolean
 *                   example: true
 *                 clientSecret:
 *                   type: string
 *                   example: "pi_12345_secret_67890"
 *                 status:
 *                   type: string
 *                   example: "requires_action"
 *                 error:
 *                   type: string
 *                   example: "Your card was denied, please provide a new payment method"
 *       '500':
 *         description: Internal server error
 */
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
            "productVariant": decoded._id,
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
          const productVariant = await ProductVariant.findById(decoded._id).exec();
          productVariant.stockOuttake -= item.quantity;
          productVariant.save();
        });

      } catch (error) {
        console.log("Error creating order", error);
      }
    }    
    res.send(generateResponse(intent));
  }
  catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, etc
    // See https://stripe.com/docs/declines/codes for more
    res.send({ error: e.message });
  }
});

/**
 * @swagger
 * /api/ecom/stripe-pay-intent-id:
 *   post:
 *     summary: Confirm a PaymentIntent with an Intent ID
 *     tags: [Ecommerce]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntentIdRequestBody'
 *     responses:
 *       '200':
 *         description: PaymentIntent confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requiresAction:
 *                   type: boolean
 *                   example: true
 *                 clientSecret:
 *                   type: string
 *                   example: "pi_12345_secret_67890"
 *                 status:
 *                   type: string
 *                   example: "requires_action"
 *                 error:
 *                   type: string
 *                   example: "Your card was denied, please provide a new payment method"
 *       '500':
 *         description: Internal server error
 */

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