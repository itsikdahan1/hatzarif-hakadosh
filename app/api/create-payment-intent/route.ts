import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("STRIPE_SECRET_KEY is missing. Payment features will be disabled.");
      return null;
    }
    stripe = new Stripe(key);
  }
  return stripe;
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "ils", metadata } = await request.json();
    const stripeClient = getStripe();

    if (!stripeClient) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        ...metadata,
        source: "JewishDonationApp",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
