export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">IMPORTANT:</p>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
              Please read this Terms of Service Agreement carefully before using Sendlr.ai. By clicking 
              "accept" or using our service, you agree to be bound by these terms. If you do not agree 
              to these terms, please do not use our service.
            </p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," 
              "you," or "your") and AGIT S.A. de C.V. ("Company," "we," "us," or "our") governing your 
              access to and use of Sendlr.ai, our software-as-a-service platform for automated outbound 
              sales and email management (the "Service").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Sendlr.ai, you agree to be bound by these Terms. If you disagree 
              with any part of these Terms, you may not access or use the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sendlr.ai is an AI-powered sales automation platform that enables users to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Create and manage email sequences and templates</li>
              <li>Automatically send personalized emails to prospects</li>
              <li>Analyze prospect responses using artificial intelligence</li>
              <li>Automatically schedule meetings when prospects show interest</li>
              <li>Track email opens, replies, and meeting scheduling</li>
              <li>Integrate with CRM systems (Salesforce, HubSpot, Attio)</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Account Registration and Security</h2>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">3.1 Registration</h3>
              <p className="text-muted-foreground leading-relaxed">
                To use Sendlr.ai, you must register for an account using your Google account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">3.2 Google Account Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                By connecting your Google account, you grant us permission to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your Gmail to send emails and read responses</li>
                <li>Access your Google Calendar to schedule meetings</li>
                <li>Use your profile information for account setup</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You may revoke these permissions at any time through your Google account settings or by 
                disconnecting your account in Sendlr.ai.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use Sendlr.ai only for lawful purposes and in accordance with these Terms. 
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Send spam, unsolicited bulk emails, or emails that violate anti-spam laws (CAN-SPAM Act, GDPR, etc.)</li>
              <li>Use the Service to send emails to recipients who have not opted in or consented to receive communications</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
              <li>Upload, transmit, or distribute any content that is illegal, harmful, threatening, abusive, or offensive</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Resell, sublicense, or redistribute the Service without our written permission</li>
            </ul>
          </section>

          {/* Email Sending Policies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Email Sending Policies</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for ensuring that all emails sent through Sendlr.ai comply with applicable 
              laws and regulations, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>CAN-SPAM Act (US):</strong> Include opt-out mechanisms and accurate sender information</li>
              <li><strong>GDPR (EU):</strong> Obtain proper consent and provide data subject rights</li>
              <li><strong>CASL (Canada):</strong> Comply with Canadian anti-spam legislation</li>
              <li><strong>Local Laws:</strong> Comply with all applicable local email marketing laws</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We reserve the right to suspend or terminate accounts that violate these policies or engage 
              in spam activities. We may also implement rate limits to prevent abuse.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">6.1 Our Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Service, including all software, designs, text, graphics, logos, and other content, 
                is owned by AGIT S.A. de C.V. and protected by copyright, trademark, and other intellectual 
                property laws. You may not copy, modify, distribute, or create derivative works without our 
                written permission.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">6.2 Your Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you upload, create, or transmit through the Service 
                (e.g., email templates, prospect data). By using the Service, you grant us a limited, 
                non-exclusive license to use, store, and process your content solely to provide the Service.
              </p>
            </div>
          </section>

          {/* Payment and Billing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Payment and Billing</h2>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">7.1 Subscription Plans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sendlr.ai offers various subscription plans. Pricing and features are subject to change 
                with notice. You agree to pay all fees associated with your selected plan.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">7.2 Billing and Renewal</h3>
              <p className="text-muted-foreground leading-relaxed">
                Subscriptions automatically renew at the end of each billing period unless you cancel. 
                You may cancel your subscription at any time through your account settings. Cancellation 
                takes effect at the end of the current billing period.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">7.3 Refunds</h3>
              <p className="text-muted-foreground leading-relaxed">
                Refunds are provided at our sole discretion. If you are not satisfied with the Service, 
                please contact us within 30 days of your initial purchase to request a refund.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your use of Sendlr.ai is also governed by our Privacy Policy. Please review our Privacy 
              Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE 
              WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER 
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE 
              LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          {/* Indemnification */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless AGIT S.A. de C.V. and its officers, 
              directors, employees, and agents from any claims, damages, losses, liabilities, and expenses 
              (including legal fees) arising from your use of the Service, violation of these Terms, or 
              infringement of any rights of another party.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your account and access to the Service at any time, with or 
              without cause or notice, for any reason, including violation of these Terms. Upon termination, 
              your right to use the Service will immediately cease.
            </p>
          </section>

          {/* Governing Law */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Mexico, 
              without regard to its conflict of law provisions. Any disputes arising from these Terms 
              shall be subject to the exclusive jurisdiction of the courts of Mexico.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">14. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of material 
              changes by posting the updated Terms on this page and updating the "Last Updated" date. 
              Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 border-t pt-8">
            <h2 className="text-2xl font-semibold">15. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium">AGIT S.A. de C.V.</p>
              <p className="text-muted-foreground">Email: <a href="mailto:legal@sendlr.ai" className="text-primary hover:underline">legal@sendlr.ai</a></p>
              <p className="text-muted-foreground">Website: <a href="https://sendlr.ai" className="text-primary hover:underline">https://sendlr.ai</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

