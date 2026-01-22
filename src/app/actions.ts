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
    let errorMessage = e.message || "Failed to generate text. The AI might be having an emotional day.";
    if (e.message && (e.message.includes("API key not valid") || e.message.includes("API key not found"))) {
        errorMessage = "Google AI API key is invalid or missing. Please ensure your GEMINI_API_KEY in the .env.local file is correct and that you have restarted your development server."
    }
    return { error: errorMessage };
  }
}

export async function createStripeSession(data: { reason: string; persona: string }): Promise<{ sessionId?: string; error?: string }> {
  const missingVars = [];
  if (!process.env.STRIPE_SECRET_KEY) {
    missingVars.push("STRIPE_SECRET_KEY");
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    missingVars.push("NEXT_PUBLIC_APP_URL");
  }

  if (missingVars.length > 0) {
      const varList = missingVars.join(', ');
      return { error: `Server configuration error. The following environment variables are missing from your .env.local file: ${varList}. Please ensure the file exists, the variables are set, and you have restarted your development server.` };
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
      return { error: "Server configuration error. The STRIPE_SECRET_KEY environment variable is missing from your .env.local file. Please ensure it is set and restart your development server." };
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
        let errorMessage = e.message || "Failed to process payment result.";
        if (e.message && (e.message.includes("API key not valid") || e.message.includes("API key not found"))) {
            errorMessage = "Google AI API key is invalid or missing. Please ensure your GEMINI_API_KEY in the .env.local file is correct and that you have restarted your development server."
        }
        return { error: errorMessage };
    }
}
