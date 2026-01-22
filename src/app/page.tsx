"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { loadStripe } from '@stripe/stripe-js';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createStripeSession } from "./actions";
import { Briefcase, Flame, Loader2 } from "lucide-react";

type Persona = "toxic" | "hr";

const formSchema = z.object({
  reason: z
    .string()
    .min(10, {
      message: "Be a little more descriptive, even if it's petty.",
    })
    .max(280, {
      message: "The reason can't be longer than a tweet.",
    }),
});

export default function Home() {
  const [persona, setPersona] = useState<Persona>("toxic");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (persona === "toxic") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [persona]);
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const response = await createStripeSession({
        reason: values.reason,
        persona: persona,
      });

      if (response.error || !response.sessionId) {
        toast({
          variant: "destructive",
          title: "Oops! Payment session error.",
          description: response.error || "We couldn't create a payment session. Please try again.",
        });
        return;
      }
      
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Stripe publishable key is not available.",
        });
        return;
      }

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      
      if (!stripe) {
          toast({
              variant: "destructive",
              title: "Oops! Stripe failed to load.",
              description: "Please check your internet connection and try again.",
          });
          return;
      }
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Oops! Could not redirect to checkout.",
          description: error.message || "Please try again.",
        });
      }
    });
  }

  const bodyFontClass = persona === 'hr' ? 'font-literata' : 'font-body';
  const headlineFontClass = persona === 'hr' ? 'font-literata' : 'font-headline';

  return (
    <main className={cn("flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12", bodyFontClass)}>
      <div className="z-10 w-full max-w-4xl items-center justify-center text-center">
        <h1 className={cn("text-4xl md:text-6xl font-bold tracking-tight", headlineFontClass)}>
          It’s Not You, It’s AI. 💔
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          We do the dirty work for $1.
        </p>

        <div className="mt-12 w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                  <div className="inline-flex items-center justify-center rounded-lg bg-muted p-1">
                      <Button
                          type="button"
                          onClick={() => setPersona('toxic')}
                          className={cn("px-4 py-2 text-sm font-medium", persona === 'toxic' ? 'bg-background text-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-background/50')}
                          >
                          <Flame className="mr-2 h-4 w-4" />
                          Toxic Chaos
                      </Button>
                      <Button
                          type="button"
                          onClick={() => setPersona('hr')}
                          className={cn("px-4 py-2 text-sm font-medium", persona === 'hr' ? 'bg-background text-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:bg-background/50')}
                          >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Professional Termination
                      </Button>
                  </div>
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn("text-lg", headlineFontClass)}>
                      Why are you dumping them?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., they clap when the plane lands, use 'doggo' unironically, or their favorite movie is a podcast."
                        className="resize-none h-24 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isPending}>
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to payment...</>
                ) : "Pay $1 & Generate"}
              </Button>
            </form>
          </Form>
        </div>

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p className="mb-2">This service is for entertainment and satirical purposes only. Responses are AI-generated parody and should not be considered professional relationship, legal, or psychological advice. The 'HR Mode' is a fictional format and does not constitute a valid legal termination of employment or contract. Do not use this service for harassment or in situations involving domestic safety concerns.</p>
          <Link href="/privacy" className="hover:underline text-primary">Privacy Policy</Link>
          <span className="mx-2">|</span>
          <Link href="/terms" className="hover:underline text-primary">Terms of Use</Link>
        </footer>
      </div>
    </main>
  );
}
