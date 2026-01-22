"use server";

import { generateBreakupText } from "@/ai/flows/generate-breakup-text";
import type { GenerateBreakupTextInput, GenerateBreakupTextOutput } from "@/ai/flows/generate-breakup-text";
import Stripe from 'stripe';

export async function generateBreakupTextAction(
  input: GenerateBreakupTextInput
): Promise<{ data?: GenerateBreakupTextOutput; error?: string }> {
  try {
    const output = await generateBreakupText(input);
    return { data: output };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to generate text. The AI might be having an emotional day." };
  }
}

export async function createStripeSession(data: { reason: string; persona: string }): Promise<{ sessionId?: string; error?: string }> {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
      return { error: "Server configuration error. Stripe keys or App URL not set." };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Breakup Text',
              description: `Persona: ${data.persona}`,
            },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        reason: data.reason,
        persona: data.persona,
      },
    });

    return { sessionId: session.id };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}


export async function retrieveCheckoutSessionAndGenerate(sessionId: string): Promise<{ data?: GenerateBreakupTextOutput; error?: string; persona?: string }> {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { error: "Server configuration error. Stripe key not set." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return { error: "Payment was not successful." };
        }

        const reason = session.metadata?.reason;
        const persona = session.metadata?.persona as 'toxic' | 'hr';

        if (!reason || !persona) {
            return { error: "Could not retrieve breakup details from session." };
        }

        const output = await generateBreakupText({ reason, persona });
        return { data: output, persona: persona };

    } catch(e: any) {
        console.error(e);
        return { error: e.message || "Failed to process payment result." };
    }
}
