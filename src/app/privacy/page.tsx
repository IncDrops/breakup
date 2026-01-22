
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-8">
          Privacy Policy
        </h1>
        <p className="text-center text-muted-foreground mb-12">Last Updated: JAN 21, 2026</p>

        <div className="space-y-8 text-left text-foreground/80">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2 text-foreground/90">Information You Provide:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Breakup Context:</strong> Details, reasons, and names you submit to our AI generation engine to create text messages.</li>
              <li><strong>Persona Selection:</strong> Your choice of tone ("Toxic" vs. "HR").</li>
              <li><strong>Payment Information:</strong> Processed securely directly through Stripe (we do not store your card details).</li>
              <li><strong>Email Address:</strong> Collected only if you request a receipt via Stripe.</li>
            </ul>
            <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground/90">Automatically Collected Information:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and timestamps</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="mb-2">We use your information strictly to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Generate the satirical or drafted breakup text message based on your inputs.</li>
              <li>Process your $1.00 micro-transaction through Stripe.</li>
              <li>Prevent fraud and abuse of the generation engine.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-4 font-bold text-foreground">Important Note: We do not use the content of your breakup messages for marketing purposes or public display without your explicit permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Data Sharing</h2>
            <p className="mb-2">We do NOT sell your personal information or the content of your messages. We share data only with the essential infrastructure required to run the app:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Stripe:</strong> For payment processing (subject to Stripe's Privacy Policy).</li>
              <li><strong>Google AI (Gemini):</strong> Your input text (breakup reason) is sent to Google's API solely for the purpose of generating the response. This data is subject to Google's Privacy Policy and data retention rules.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">4. AI Processing & Third-Party Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Generation:</strong> Your inputs are processed by third-party AI services (Google Genkit/Gemini).</li>
              <li><strong>Third-Party Privacy:</strong> You acknowledge that by inputting names or details about third parties (e.g., your partner/ex), you are doing so at your own discretion. We transmit this data to the AI provider solely to generate the requested text.</li>
              <li><strong>No Training:</strong> We do not use your specific personal inputs to train our own AI models.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Data Retention</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Transient Generation:</strong> To protect your privacy, the breakup texts and your specific inputs are not stored on our servers after the session is complete and the text is delivered to your browser.</li>
              <li><strong>Payment Records:</strong> Stripe retains transaction records as required by financial regulations (typically 7 years).</li>
              <li><strong>Analytics:</strong> We may retain anonymized, aggregate usage data (e.g., "50% of users chose Toxic Mode") indefinitely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have rights to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data (limited, as we do not store message history).</li>
              <li>Request deletion of your data.</li>
              <li>Opt-out of certain data processing.</li>
              <li>File a complaint with a data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">7. Security</h2>
            <p>We implement industry-standard security measures (SSL encryption, serverless architecture) to protect your data during transmission. However, no internet transmission is 100% secure. You use our service at your own risk.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">8. Cookies</h2>
            <p>We use essential cookies for site functionality (maintaining your session during the payment flow). We do not use tracking or third-party advertising cookies.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">9. Children's Privacy</h2>
            <p>Our service is strictly not intended for users under 18. We do not knowingly collect information from minors. If we discover a minor has used the payment service, we will take steps to delete relevant records where possible.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">10. Content Policy (Harassment)</h2>
            <p>While we prioritize user privacy, we reserve the right to block inputs that generate hate speech, threats of violence, or illegal content.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">11. Changes to Privacy Policy</h2>
            <p>We may update this policy. Continued use after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">12. Contact</h2>
            <p>For privacy concerns, contact us at: <a href="mailto:answers@enditforme.com" className="text-primary hover:underline">answers@enditforme.com</a></p>
          </section>

        </div>
        <div className="text-center mt-12">
            <Link href="/" className="text-primary hover:underline">
                &larr; Back to Home
            </Link>
        </div>
      </div>
    </main>
  );
}
