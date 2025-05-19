import Payment from "../models/payment.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { amount, currency = "usd", paymentMethod } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ["card"],
    });
    console.log("currency", currency);

    console.log("paymentIntent", paymentIntent);

    const paymentRecord = await Payment.create({
      amount,
      currency,
      paymentMethod,
      stripePaymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      payment: paymentRecord,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
