
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was not processed. You can go back to the home page and try again if you'd like.
          </p>
          <Button asChild>
            <Link href="/">&larr; Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
