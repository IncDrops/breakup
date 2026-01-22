"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

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
import { generateBreakupTextAction } from "./actions";
import type { GenerateBreakupTextOutput } from "@/ai/flows/generate-breakup-text";
import { Briefcase, Download, Flame, Loader2, MessageCircleWarning, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

const IMessageBubble = ({ text }: { text: string }) => {
  return (
    <div className="w-full flex justify-end">
      <div className="bg-blue-600 text-white p-3 rounded-2xl max-w-md">
        <p className="text-left text-base">{text}</p>
      </div>
    </div>
  );
};

const OutlookWindow = ({ text }: { text: string }) => {
  return (
    <Card className="max-w-2xl mx-auto font-literata shadow-lg border-2">
      <CardHeader className="border-b bg-secondary/50 p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            To: <span className="text-foreground">All Staff</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Subject:{" "}
            <span className="text-foreground font-semibold">
              Regarding Your Employment Status
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <p className="whitespace-pre-wrap text-sm">{text}</p>
      </CardContent>
    </Card>
  );
};


export default function Home() {
  const [persona, setPersona] = useState<Persona>("toxic");
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateBreakupTextOutput | null>(null);
  const [copied, setCopied] = useState(false);
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
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `end-it-for-me-${persona}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setResult(null);
    startTransition(async () => {
      const result = await generateBreakupTextAction({
        reason: values.reason,
        persona: persona,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: result.error,
        });
      } else {
        setResult(result.data);
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : "Generate Breakup Text"}
              </Button>
            </form>
          </Form>
        </div>

        {isPending && (
           <div className="mt-12 w-full text-center">
             <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
             <p className="mt-4 text-muted-foreground">Crafting the perfect ending...</p>
           </div>
        )}

        {result && (
          <div className="mt-12 w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <h2 className={cn("text-3xl font-bold text-center mb-6", headlineFontClass)}>Your Breakup Is Served</h2>
            
            <div className="bg-card p-6 rounded-lg shadow-xl border">
              {persona === 'toxic' ? (
                <div className="bg-black p-4 rounded-lg">
                  <IMessageBubble text={result.text_body} />
                </div>
              ) : (
                <OutlookWindow text={result.text_body} />
              )}
              
              <div className="mt-6 flex items-center justify-end space-x-2">
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(result.text_body)}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy text</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(result.text_body)}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download text</span>
                  </Button>
              </div>

              <Separator className="my-6" />

              <div className="bg-accent/20 border-l-4 border-accent p-4 rounded-r-lg">
                <div className="flex">
                  <div className="py-1"><MessageCircleWarning className="h-5 w-5 text-accent-foreground/80 mr-3" /></div>
                  <div>
                    <h3 className="font-bold text-accent-foreground">Pro Tip</h3>
                    <p className="text-sm text-accent-foreground/80">{result.follow_up_tip}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p className="mb-2">This service is for entertainment and satirical purposes only. Responses are AI-generated parody and should not be considered professional relationship, legal, or psychological advice. The 'HR Mode' is a fictional format and does not constitute a valid legal termination of employment or contract. Do not use this service for harassment or in situations involving domestic safety concerns.</p>
          <Link href="/privacy" className="hover:underline text-primary">Privacy Policy</Link>
        </footer>
      </div>
    </main>
  );
}
