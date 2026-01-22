# **App Name**: EndItForMe

## Core Features:

- Reason Input: Text area for the user to input the reason for the breakup.
- Persona Toggle: Toggle switch to select between 'Toxic Chaos' and 'Corporate HR' personas. The choice affects the subsequent AI output.
- Breakup Text Generation: Genkit flow generates a breakup text based on the input reason and selected persona using a Large Language Model tool. Output includes text body and follow-up tip. Based on user inputs, the Large Language Model (LLM) tool decides which kind of text is best
- Message Style Rendering: Renders the generated text in a CSS-styled iMessage bubble (Toxic) or Outlook/Email window (HR).
- Stripe Payment Integration: Server Action to create a Stripe Checkout session for $1.00. Stores reason and persona in session metadata to use post-payment.
- Downloadable Output: Offer the generated response downloadable as a .txt file.

## Style Guidelines:

- Toxic Mode: Primary color is vivid red (#EF4444), evoking the concept of anger or danger.
- Toxic Mode: Background is black (#000000), establishing a dark, edgy aesthetic.
- Toxic Mode: Accent color is a neon pink (#FF69B4) that highlights the artificial nature of Toxic's AI-created emotional content.
- HR Mode: Primary color is cool grey (#64748B), in line with a serious mood.
- HR Mode: Background is light beige (#F5F5DC), which feels professional.
- HR Mode: Accent color is a darker blue-grey (#4A5568) offering strong contrast in a monochrome scheme.
- Toxic Mode: Font: 'Space Grotesk' (sans-serif) for headlines; 'Inter' (sans-serif) for body, providing a computerized look to go along with its cold, calculated nature.
- HR Mode: Font: 'Literata' (serif) for headlines and body text, which contributes to its 'legal document' feel.
- Toxic Mode: Use red flag emojis (🚩) sparingly, in line with the persona.
- Hero Section: Headline 'It’s Not You, It’s AI.' and Subhead 'We do the dirty work for $1.'
- The Input: A text area with the label: 'Why are you dumping them?'
- Subtle transitions when switching between Toxic and HR modes.