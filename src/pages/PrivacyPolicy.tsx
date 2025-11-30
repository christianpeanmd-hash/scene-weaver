import { Link } from "react-router-dom";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <TechyMemoLogo size="sm" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy – TechyMemo</h1>
          <p className="text-muted-foreground mb-8">Effective date: December 1, 2024</p>

          <p className="text-foreground/90">
            This Privacy Policy explains how TechyMemo ("TechyMemo", "we", "us", or "our") collects, uses, and shares information when you use our website, apps, and related services that link to this Policy (collectively, the "Service").
          </p>
          <p className="text-foreground/90">
            By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
          <p className="text-foreground/90">
            If you have any questions, contact us at{" "}
            <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
              hello@techysurgeon.com
            </a>.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-foreground/90">We collect information in three main ways:</p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.1 Information you provide directly</h3>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Account information (such as name, email address, password).</li>
            <li>
              Content you upload or paste into TechyMemo:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Text (scripts, memos, decks, briefs, prompts).</li>
                <li>Images, video references, and any other assets you provide.</li>
              </ul>
            </li>
            <li>
              Communication data:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Messages you send us (support requests, feedback, survey responses).</li>
              </ul>
            </li>
            <li>
              Billing information:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment information is processed by our third-party payment processor (e.g. Stripe). We do not store full payment card numbers on our servers.</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.2 Information collected automatically</h3>
          <p className="text-foreground/90">When you use the Service, we automatically collect:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Log data (IP address, browser type, OS, referring URLs, pages viewed, access times).</li>
            <li>Usage data (features you use, clicks, files generated, error reports).</li>
            <li>Device data (device type, screen resolution, language, approximate location based on IP).</li>
          </ul>
          <p className="text-foreground/90 mt-2">We may use cookies, web beacons, local storage, and similar technologies to collect this data.</p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1.3 Information from third parties</h3>
          <p className="text-foreground/90">We may receive information from:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Authentication providers (if you sign in with Google, GitHub, etc.).</li>
            <li>Analytics and advertising partners (aggregated usage statistics, campaign performance).</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-foreground/90">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Provide, operate, and maintain the Service.</li>
            <li>Generate AI-powered prompts, images, videos, infographics, and 1-pagers based on your inputs.</li>
            <li>Personalize your experience (e.g., recent projects, saved styles).</li>
            <li>
              Communicate with you:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Service-related emails, updates, security notifications.</li>
                <li>Respond to support requests and feedback.</li>
              </ul>
            </li>
            <li>Analyze usage and improve the Service (product development, new features).</li>
            <li>Monitor and enhance security (detect abuse, fraud, and technical issues).</li>
            <li>Comply with legal obligations and enforce our Terms of Service.</li>
          </ul>
          <p className="text-foreground/90 mt-2">We may aggregate and anonymize data to analyze trends and improve the Service; aggregated data does not identify you personally.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. AI Models and Third-Party Service Providers</h2>
          <p className="text-foreground/90">
            To generate prompts, images, videos, and other outputs, we may send your content to third-party AI model providers and infrastructure services (for example, cloud hosting, logging, analytics, payment processing).
          </p>
          <p className="text-foreground/90">
            These providers process your data on our behalf and are contractually required to use it only as necessary to provide their services to us.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. How We Share Information</h2>
          <p className="text-foreground/90 font-medium">We do not sell your personal information.</p>
          <p className="text-foreground/90">We may share information in these situations:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li><strong>Service providers:</strong> With vendors that perform services for us (hosting, payment processing, analytics, email delivery, customer support, AI model providers).</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, financing, or sale of all or part of our business. We will take reasonable steps to require the new entity to honor this Privacy Policy.</li>
            <li>
              <strong>Legal requirements:</strong> If required by law or in good faith belief that such action is necessary to:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Comply with a legal obligation or government request.</li>
                <li>Protect the rights, property, or safety of TechyMemo, our users, or others.</li>
                <li>Enforce our Terms of Service or investigate potential violations.</li>
              </ul>
            </li>
          </ul>
          <p className="text-foreground/90 mt-2">We may share aggregated, de-identified information that cannot reasonably be used to identify you.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="text-foreground/90">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Keep you logged in.</li>
            <li>Remember your preferences.</li>
            <li>Understand how the Service is used and improve performance.</li>
            <li>Measure the effectiveness of marketing campaigns.</li>
          </ul>
          <p className="text-foreground/90 mt-2">You can usually instruct your browser to refuse cookies or indicate when a cookie is being sent. If you disable cookies, some features of the Service may not function properly.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Data Retention</h2>
          <p className="text-foreground/90">We retain personal information for as long as necessary to:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Provide the Service.</li>
            <li>Comply with legal obligations.</li>
            <li>Resolve disputes and enforce our agreements.</li>
          </ul>
          <p className="text-foreground/90 mt-2">We may retain aggregated, de-identified data for longer periods for analytics and product improvement.</p>
          <p className="text-foreground/90">
            If you'd like us to delete your account and associated personal data, email{" "}
            <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
              hello@techysurgeon.com
            </a>{" "}
            and we'll process your request subject to any legal obligations.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Security</h2>
          <p className="text-foreground/90">
            We use reasonable technical and organizational measures to protect your information (encryption in transit, access controls, monitoring). However, no method of transmission or storage is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Children's Privacy</h2>
          <p className="text-foreground/90">
            The Service is not intended for children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can delete it.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. International Users</h2>
          <p className="text-foreground/90">
            Our servers may be located in the United States and other countries. If you access the Service from outside these locations, you consent to the transfer, storage, and processing of your information in those jurisdictions, which may have different data protection laws than your country.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Your Rights and Choices</h2>
          <p className="text-foreground/90">Depending on your jurisdiction, you may have rights such as:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Accessing the personal data we hold about you.</li>
            <li>Correcting or updating your information.</li>
            <li>Requesting deletion of your personal data.</li>
            <li>Objecting to or restricting certain processing.</li>
            <li>Withdrawing consent where processing is based on consent.</li>
          </ul>
          <p className="text-foreground/90 mt-2">
            To exercise these rights, contact{" "}
            <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
              hello@techysurgeon.com
            </a>. We may verify your identity before responding.
          </p>
          <p className="text-foreground/90">
            You can also opt out of non-essential marketing emails by using the unsubscribe link in those emails.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Changes to this Privacy Policy</h2>
          <p className="text-foreground/90">
            We may update this Privacy Policy from time to time. When we do, we'll update the "Effective date" and, where appropriate, notify you by email or through the Service. Your continued use of the Service after changes become effective means you accept the updated Policy.
          </p>
        </article>
      </main>
    </div>
  );
}
