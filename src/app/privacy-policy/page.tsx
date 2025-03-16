import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - TikTok Stream Manager',
  description: 'Privacy Policy for TikTok Stream Manager',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          TikTok Stream Manager (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
          your information when you use our application. Please read this privacy policy carefully.
          If you do not agree with the terms of this privacy policy, please do not access the
          application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>
          We collect several types of information from and about users of our application,
          including:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            <strong>Personal Information:</strong> TikTok account information that you authorize us
            to access through TikTok&apos;s API, including your TikTok username, profile
            information, and content.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our application, including
            analytics data, time spent on pages, and features used.
          </li>
          <li>
            <strong>Stream Data:</strong> Information related to your TikTok streams, including
            viewer counts, engagement metrics, and stream analytics.
          </li>
          <li>
            <strong>Device Information:</strong> Information about the device and browser you use to
            access our application, including IP address, browser type, and operating system.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use the information we collect about you to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide, operate, and maintain our application;</li>
          <li>Improve, personalize, and expand our application&apos;s features;</li>
          <li>Understand and analyze how you use our application;</li>
          <li>Develop new products, services, features, and functionality;</li>
          <li>Communicate with you about our application updates and features;</li>
          <li>Find and prevent fraud and security issues.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. TikTok Data Usage</h2>
        <p>
          Our application connects to your TikTok account through TikTok&apos;s official API. We
          only collect and use data as permitted by TikTok&apos;s Developer Terms and Platform
          Policy. We do not store your TikTok password or other sensitive credentials. You can
          revoke our application&apos;s access to your TikTok account at any time through
          TikTok&apos;s settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your
          personal information from unauthorized access, alteration, disclosure, or destruction.
          However, no method of transmission over the Internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
        <p>
          We retain your information only for as long as necessary to fulfill the purposes outlined
          in this Privacy Policy, unless a longer retention period is required or permitted by law.
          When we no longer need to use your information, we will securely delete or anonymize it.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Services</h2>
        <p>
          Our application may use third-party services that collect information used to identify
          you. These third-party services have their own privacy policies addressing how they use
          such information. We encourage you to review the privacy policies of these third-party
          services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children&apos;s Privacy</h2>
        <p>
          Our application is not intended for use by children under 13 years of age. We do not
          knowingly collect personal information from children under 13. If we learn we have
          collected or received personal information from a child under 13, we will delete that
          information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal
          information, including:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>The right to access the personal information we hold about you;</li>
          <li>The right to request correction or deletion of your personal information;</li>
          <li>The right to object to processing of your personal information;</li>
          <li>The right to data portability;</li>
          <li>The right to withdraw consent at any time.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to this Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the &quot;Last updated&quot;
          date. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at
          privacy@tiktokapistreaming.com.
        </p>
      </div>
    </div>
  );
}
