"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { retrieveCheckoutSessionAndGenerate } from "../actions";
import type { GenerateBreakupTextOutput } from "@/ai/flows/generate-breakup-text";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, MessageCircleWarning, Copy, Check, Download, AlertTriangle } from "lucide-react";

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


function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateBreakupTextOutput | null>(null);
  const [persona, setPersona] = useState<"toxic" | "hr" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (persona === "toxic") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [persona]);

  useEffect(() => {
    if (sessionId) {
      startTransition(async () => {
        const response = await retrieveCheckoutSessionAndGenerate(sessionId);
        if (response.error) {
          setError(response.error);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: response.error,
          });
        } else if (response.data && response.persona) {
          setResult(response.data);
          setPersona(response.persona as "toxic" | "hr");
        }
      });
    } else {
      setError("No session ID found. Your payment may not have been processed correctly.");
    }
  }, [sessionId, toast]);
  
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

  const bodyFontClass = persona === 'hr' ? 'font-literata' : 'font-body';
  const headlineFontClass = persona === 'hr' ? 'font-literata' : 'font-headline';

  return (
    <main className={cn("flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12", bodyFontClass)}>
       <div className="z-10 w-full max-w-4xl items-center justify-center text-center">
        {isPending && (
           <div className="mt-12 w-full text-center">
             <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
             <p className="mt-4 text-muted-foreground">Verifying payment and generating your text...</p>
           </div>
        )}

        {error && (
          <div className="mt-12 w-full max-w-xl mx-auto text-center bg-destructive/10 border border-destructive/50 p-8 rounded-lg">
             <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
             <h2 className="mt-4 text-2xl font-bold text-destructive-foreground">An Error Occurred</h2>
             <p className="mt-2 text-destructive-foreground/80">{error}</p>
             <Button asChild variant="destructive" className="mt-6">
                <Link href="/">Go Back Home</Link>
             </Button>
           </div>
        )}

        {result && persona && (
          <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500 w-full">
            <h1 className={cn("text-3xl md:text-5xl font-bold tracking-tight mb-2", headlineFontClass)}>
              Payment Successful!
            </h1>
            <p className="mt-2 text-lg md:text-xl text-muted-foreground mb-10">
              Your breakup is served.
            </p>
            
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
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/">Start a New Breakup</Link>
              </Button>
            </div>
          </div>
        )}
       </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
