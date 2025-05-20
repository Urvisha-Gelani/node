import Stripe from "stripe";
import paymentCreated from "../services/paymentService.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const {
      amount,
      currency = "usd",
      paymentMethodId,
      payableUserId,
    } = req.body;
    console.log("req.user:", req.user);
    const loginUserId = req.user.id;
    console.log("amount:", amount);
    console.log("currency:", currency);
    console.log("paymentMethodId:", paymentMethodId);
    if (!amount || amount < 0.5) {
      return res
        .status(422)
        .json({ error: "Amount must be at least $0.50 USD" });
    }

    if (!paymentMethodId) {
      return res.status(422).json({ error: "PaymentMethodId are required." });
    }
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // 👈 This is the key to solve your error
      },
    });

    console.log("PaymentIntent:", paymentIntent);

    if (paymentIntent.status === "succeeded") {
      const payment = await paymentCreated({
        amount: amountInCents,
        currency,
        paymentMethod: paymentMethodId,
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        payableUserId,
        loginUserId,
      });

      return res.status(201).json({
        message: "✅ Payment successful",
        status: paymentIntent.status,
        payment,
      });
    }
    // else {
    //   // Save it even if it's not successful (optional tracking)
    //   await Payment.create({
    //     amount,
    //     currency,
    //     paymentMethod: paymentMethodId,
    //     stripePaymentIntentId: paymentIntent.id,
    //     status: paymentIntent.status,
    //   });

    //   return res.status(202).json({
    //     message: `⚠ Payment status: ${paymentIntent.status}`,
    //     status: paymentIntent.status,
    //     paymentIntentId: paymentIntent.id,
    //   });
    // }
  } catch (error) {
    console.error("Stripe Error:", error);

    if (error.raw && error.raw.payment_intent) {
      const intent = error.raw.payment_intent;
      console.log("PaymentIntent from error:", intent);
      console.log("Error message:", error.message);
      console.log("Error code:", error.code);
      // Optionally store the failed attempt
      // await paymentCreated({
      //   amount: Math.round(req.body.amount * 100),
      //   currency: req.body.currency || "usd",
      //   paymentMethod: req.body.paymentMethodId,
      //   stripePaymentIntentId: intent.id,
      //   status: intent.status,
      //   payableUserId: req.body.payableUserId,
      //   loginUserId: req.user.id,
      // });

      return res.status(422).json({
        error: error.message,
        paymentIntentId: intent.id,
        status: intent.status,
      });
    }

    return res.status(500).json({ error: "Something went wrong" });
  }
};
