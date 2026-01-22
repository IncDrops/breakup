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
        errorMessage = "Google AI API key is invalid or missing. If you're running locally, ensure your GEMINI_API_KEY is set in your .env.local file and that you've restarted your development server. For a live site, you must set this as a secret in your hosting environment."
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
      const message = `Server configuration error. The following environment variables are missing: ${varList}. If running locally, check your .env.local file and restart the server. For a live site, ensure these are set as secrets in your hosting environment.`;
      return { error: message };
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
      return { error: "Server configuration error. STRIPE_SECRET_KEY is missing. If running locally, check your .env.local file and restart the server. For a live site, ensure this is set as a secret in your hosting environment." };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Idempotency check: Has this session already been processed?
        if (session.metadata?.generated === 'true') {
            return { error: "This breakup has already been generated. Please start a new one if you'd like to try again." };
        }

        if (session.payment_status !== 'paid') {
            return { error: "Payment was not successful." };
        }

        const reason = session.metadata?.reason;
        const persona = session.metadata?.persona as 'toxic' | 'hr';

        if (!reason || !persona) {
            return { error: "Could not retrieve breakup details from session." };
        }

        const output = await generateBreakupText({ reason, persona });

        // Mark the session as processed to prevent re-generation
        await stripe.checkout.sessions.update(sessionId, {
            metadata: { ...session.metadata, generated: 'true' }
        });
        
        return { data: output, persona: persona };

    } catch(e: any) {
        console.error(e);
        let errorMessage = e.message || "Failed to process payment result.";
        if (e.message && (e.message.includes("API key not valid") || e.message.includes("API key not found"))) {
            errorMessage = "Google AI API key is invalid or missing. If you're running locally, ensure your GEMINI_API_KEY is set in your .env.local file and that you've restarted your development server. For a live site, you must set this as a secret in your hosting environment."
        }
        return { error: errorMessage };
    }
}
