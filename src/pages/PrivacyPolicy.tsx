export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Sendler.ai ("we," "our," or "us"). Sendler.ai is operated by AGIT S.A. de C.V., 
              a company registered in Mexico. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our software-as-a-service platform for automated 
              outbound sales and email management.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using Sendler.ai, you agree to the collection and use of information in accordance with 
              this Privacy Policy. If you do not agree with our policies and practices, please do not use 
              our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium">2.1 Information You Provide</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Account Information:</strong> Name, email address, and profile information when you sign up</li>
                <li><strong>Prospect Data:</strong> Contact names, email addresses, company information, and other data you import or enter</li>
                <li><strong>Email Templates:</strong> Email content, subjects, and sequences you create</li>
                <li><strong>Configuration Data:</strong> Timezone settings, working hours, and automation preferences</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">2.2 Information from Google Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you connect your Google account, we access:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Gmail:</strong> To send emails on your behalf and read responses from prospects</li>
                <li><strong>Google Calendar:</strong> To schedule meetings and check availability</li>
                <li><strong>User Profile:</strong> Basic profile information (name, email) for account setup</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We only access the minimum permissions necessary to provide our service. We do not store 
                your Google account password.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">2.3 Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Usage Data:</strong> How you interact with our platform, features used, and time spent</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system</li>
                <li><strong>Email Analytics:</strong> Email open rates, reply rates, and meeting scheduling data</li>
                <li><strong>Performance Data:</strong> System logs, error reports, and performance metrics</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Send automated emails and manage email sequences on your behalf</li>
              <li>Analyze prospect responses using AI and schedule meetings automatically</li>
              <li>Process and respond to your inquiries and support requests</li>
              <li>Send you service-related notifications and updates</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
              <li>Generate aggregated, anonymized analytics and insights</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., cloud hosting, database services, AI processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              <li><strong>CRM Integrations:</strong> When you connect a CRM (Salesforce, HubSpot, Attio), we sync activity data as configured</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Secure authentication using OAuth 2.0</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular backups and disaster recovery procedures</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as necessary to provide our services and fulfill 
              the purposes described in this Privacy Policy. When you delete your account, we will delete 
              or anonymize your personal information within 30 days, except where we are required to retain 
              it for legal, regulatory, or legitimate business purposes.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Your Rights and Choices</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Revoke Access:</strong> Disconnect your Google account or CRM integrations at any time</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          {/* International Transfers */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country 
              of residence. These countries may have data protection laws that differ from those in your 
              country. We ensure appropriate safeguards are in place to protect your information in 
              accordance with this Privacy Policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sendler.ai is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a 
              child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4 border-t pt-8">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium">AGIT S.A. de C.V.</p>
              <p className="text-muted-foreground">Email: <a href="mailto:privacy@sendler.ai" className="text-primary hover:underline">privacy@sendler.ai</a></p>
              <p className="text-muted-foreground">Website: <a href="https://sendler.ai" className="text-primary hover:underline">https://sendler.ai</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

