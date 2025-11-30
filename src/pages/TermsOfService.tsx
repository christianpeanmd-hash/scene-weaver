import { Link } from "react-router-dom";
import { TechyMemoLogo } from "@/components/MemoableLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service – TechyMemo</h1>
          <p className="text-muted-foreground mb-8">Effective date: December 1, 2024</p>

          <p className="text-foreground/90">
            These Terms of Service ("Terms") govern your access to and use of the TechyMemo website, applications, and related services (collectively, the "Service") provided by TechyMemo ("TechyMemo", "we", "us", or "our").
          </p>
          <p className="text-foreground/90">
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Eligibility</h2>
          <p className="text-foreground/90">You may use the Service only if you:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Are at least 13 years old (or the minimum age of digital consent in your jurisdiction), and</li>
            <li>Have the power to enter a binding contract with us and are not barred from doing so under any applicable laws.</li>
          </ul>
          <p className="text-foreground/90 mt-2">If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of the Service</h2>
          <p className="text-foreground/90">TechyMemo provides tools to turn text and other inputs into:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>AI-assisted prompts</li>
            <li>Storyboards and scene breakdowns</li>
            <li>Images, videos, infographics, and 1-page explainers (collectively, "Outputs").</li>
          </ul>
          <p className="text-foreground/90 mt-2">
            Outputs may be generated within TechyMemo or via prompts designed for third-party AI tools (e.g., Sora, Veo, Midjourney).
          </p>
          <p className="text-foreground/90">We may update, modify, or discontinue parts of the Service at any time with or without notice.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Accounts and Security</h2>
          <p className="text-foreground/90">You are responsible for:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Maintaining the confidentiality of your account credentials.</li>
            <li>All activity under your account.</li>
          </ul>
          <p className="text-foreground/90 mt-2">
            Notify us immediately at{" "}
            <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
              hello@techysurgeon.com
            </a>{" "}
            if you suspect unauthorized access to your account. We are not liable for losses arising from unauthorized use of your credentials if you fail to keep them secure.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. User Content</h2>
          <p className="text-foreground/90">
            "User Content" means any content you upload, input, or otherwise submit to the Service, including text, images, video references, and other materials.
          </p>
          <p className="text-foreground/90">You retain all rights to your User Content, subject to the license granted below.</p>
          <p className="text-foreground/90">You are solely responsible for your User Content and represent that:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>You have the necessary rights to submit it.</li>
            <li>It does not violate any laws or third-party rights (including copyright, trademark, privacy, or publicity rights).</li>
            <li>It does not contain harmful, unlawful, or abusive material.</li>
          </ul>
          <p className="text-foreground/90 mt-2">We may, but are not obligated to, review or remove User Content that violates these Terms or our policies.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. License You Grant to TechyMemo</h2>
          <p className="text-foreground/90">By submitting User Content, you grant TechyMemo a worldwide, non-exclusive, royalty-free license to:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Host, store, process, reproduce, modify, adapt, translate, and create derivative works from your User Content as needed to provide and improve the Service.</li>
            <li>Generate Outputs based on your User Content and to display those Outputs to you.</li>
            <li>Use aggregated and de-identified data derived from your use of the Service to improve our models, analytics, and features.</li>
          </ul>
          <p className="text-foreground/90 mt-2">We do not claim ownership of your User Content or Outputs.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. AI Outputs and Third-Party Tools</h2>
          <p className="text-foreground/90">Outputs are generated using AI models and may be inaccurate, incomplete, or unexpected. You are responsible for reviewing and verifying Outputs before using them.</p>
          <p className="text-foreground/90">We make no warranties regarding the legality, accuracy, or suitability of Outputs for any purpose.</p>
          <p className="text-foreground/90">You are responsible for ensuring your use of Outputs (including in third-party tools) complies with applicable laws and third-party terms.</p>
          <p className="text-foreground/90">
            When you copy prompts or use TechyMemo with external AI providers (e.g., Sora, Veo, Runway, Midjourney), your use of those tools is governed by those providers' terms and privacy policies, not ours.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Prohibited Uses</h2>
          <p className="text-foreground/90">You agree not to:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation.</li>
            <li>Upload or generate content that is illegal, defamatory, harassing, hateful, discriminatory, sexually explicit, or otherwise objectionable.</li>
            <li>Attempt to reverse engineer, decompile, or otherwise derive the source code of the Service (except as permitted by law).</li>
            <li>Circumvent or attempt to circumvent any security or access control.</li>
            <li>Use the Service to train or improve competing models or services without our express written consent.</li>
            <li>Use automated systems (bots, scrapers, crawlers) to access the Service in a manner that sends more request messages than a human can reasonably produce in the same period, except as explicitly allowed through an API we provide.</li>
          </ul>
          <p className="text-foreground/90 mt-2">We may suspend or terminate your access if we reasonably believe you have violated these Terms.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Subscription Plans, Fees, and Refunds</h2>
          <p className="text-foreground/90">Certain features of the Service may require a paid subscription or one-time purchase ("Paid Services").</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Prices, features, and limitations of Paid Services are described on our Pricing page or in your order form.</li>
            <li>Payments are processed by our third-party payment processor. By providing payment information, you authorize us and our processor to charge the applicable fees.</li>
            <li>Subscriptions automatically renew at the end of each billing cycle unless cancelled.</li>
            <li>You may cancel a subscription at any time; however, fees paid are generally non-refundable, except where required by law.</li>
            <li>We may change prices or billing structures. If we do, we'll provide notice in advance, and changes will apply starting with your next billing period.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Intellectual Property</h2>
          <p className="text-foreground/90">
            The Service, including the website, software, design, text, graphics, logos, trademarks, and other content (excluding User Content), is owned by or licensed to TechyMemo and protected by intellectual property laws.
          </p>
          <p className="text-foreground/90">
            You are granted a limited, non-exclusive, non-transferable, revocable license to use the Service solely for your own business or personal use in accordance with these Terms. You may not copy, modify, distribute, sell, or lease any part of the Service except as expressly permitted.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Feedback</h2>
          <p className="text-foreground/90">
            If you send us suggestions, ideas, or feedback ("Feedback"), you grant us a perpetual, irrevocable, worldwide, royalty-free license to use that Feedback for any purpose without obligation to you.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Termination</h2>
          <p className="text-foreground/90">You may stop using the Service at any time.</p>
          <p className="text-foreground/90">
            We may suspend or terminate your access to the Service (or portions of it) at any time, with or without notice, if we reasonably believe you have violated these Terms or if we discontinue the Service.
          </p>
          <p className="text-foreground/90">
            Upon termination, your right to use the Service will cease. Some provisions of these Terms will survive termination, including ownership provisions, warranty disclaimers, limitations of liability, and indemnity.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">12. Disclaimer of Warranties</h2>
          <p className="text-foreground/90">
            The Service and all Outputs are provided "as is" and "as available" without warranty of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-foreground/90">We do not guarantee that:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>The Service will be uninterrupted, secure, or error-free.</li>
            <li>Outputs will be accurate, complete, or suitable for your intended use.</li>
          </ul>
          <p className="text-foreground/90 mt-2">You use the Service and Outputs at your own risk.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">13. Limitation of Liability</h2>
          <p className="text-foreground/90">To the fullest extent permitted by law:</p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>
              TechyMemo and its affiliates, officers, employees, agents, and licensors will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, arising out of or related to your use of (or inability to use) the Service or Outputs.
            </li>
            <li>
              Our total liability for any claim arising out of or relating to the Service or these Terms will not exceed the greater of:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The amount you paid to us for the Service in the 3 months preceding the claim, or</li>
                <li>USD $100.</li>
              </ul>
            </li>
          </ul>
          <p className="text-foreground/90 mt-2">Some jurisdictions do not allow certain limitations of liability, so some of the above may not apply to you.</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">14. Indemnification</h2>
          <p className="text-foreground/90">
            You agree to indemnify and hold harmless TechyMemo and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from:
          </p>
          <ul className="list-disc pl-6 text-foreground/90 space-y-2">
            <li>Your use of the Service or Outputs.</li>
            <li>Your violation of these Terms.</li>
            <li>Your violation of any rights of a third party (including intellectual property or privacy rights).</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">15. Governing Law and Dispute Resolution</h2>
          <p className="text-foreground/90">
            These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of laws principles.
          </p>
          <p className="text-foreground/90">
            You agree that any dispute arising out of or relating to these Terms or the Service will be brought exclusively in the courts located in Delaware, and you consent to the personal jurisdiction of such courts.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">16. Changes to These Terms</h2>
          <p className="text-foreground/90">
            We may update these Terms from time to time. When we do, we'll update the "Effective date" above and, where appropriate, notify you by email or through the Service.
          </p>
          <p className="text-foreground/90">
            Your continued use of the Service after the updated Terms become effective constitutes your acceptance of the changes. If you do not agree, you must stop using the Service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">17. Contact</h2>
          <p className="text-foreground/90">
            If you have questions about these Terms, please contact us at{" "}
            <a href="mailto:hello@techysurgeon.com" className="text-primary hover:underline">
              hello@techysurgeon.com
            </a>.
          </p>
        </article>
      </main>
    </div>
  );
}
