import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - TikTok Stream Manager',
  description: 'Terms of Service for TikTok Stream Manager',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to TikTok Stream Manager (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By
          accessing or using our application, you agree to be bound by these Terms of Service and
          all applicable laws and regulations. If you do not agree with any of these terms, you are
          prohibited from using this application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p>
          Permission is granted to temporarily use TikTok Stream Manager for personal,
          non-commercial use only. This is the grant of a license, not a transfer of title, and
          under this license you may not:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Modify or copy the materials;</li>
          <li>Use the materials for any commercial purpose;</li>
          <li>
            Attempt to decompile or reverse engineer any software contained in TikTok Stream
            Manager;
          </li>
          <li>Remove any copyright or other proprietary notations from the materials; or</li>
          <li>
            Transfer the materials to another person or &quot;mirror&quot; the materials on any
            other server.
          </li>
        </ul>
        <p>
          This license shall automatically terminate if you violate any of these restrictions and
          may be terminated by TikTok Stream Manager at any time.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. TikTok API Usage</h2>
        <p>
          TikTok Stream Manager utilizes the TikTok API and follows all guidelines and policies set
          by TikTok. Your use of TikTok data through our application is subject to TikTok&apos;s
          Terms of Service and Developer Terms. We do not claim ownership of TikTok content accessed
          through our application.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Disclaimer</h2>
        <p>
          The materials in TikTok Stream Manager are provided on an &quot;as is&quot; basis. TikTok
          Stream Manager makes no warranties, expressed or implied, and hereby disclaims and negates
          all other warranties including, without limitation, implied warranties or conditions of
          merchantability, fitness for a particular purpose, or non-infringement of intellectual
          property or other violation of rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitations</h2>
        <p>
          In no event shall TikTok Stream Manager or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business
          interruption) arising out of the use or inability to use TikTok Stream Manager, even if
          TikTok Stream Manager or a authorized representative has been notified orally or in
          writing of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Accuracy of Materials</h2>
        <p>
          The materials appearing in TikTok Stream Manager could include technical, typographical,
          or photographic errors. TikTok Stream Manager does not warrant that any of the materials
          on its application are accurate, complete, or current. TikTok Stream Manager may make
          changes to the materials contained on its application at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Links</h2>
        <p>
          TikTok Stream Manager has not reviewed all of the sites linked to its application and is
          not responsible for the contents of any such linked site. The inclusion of any link does
          not imply endorsement by TikTok Stream Manager of the site. Use of any such linked website
          is at the user&apos;s own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Modifications</h2>
        <p>
          TikTok Stream Manager may revise these Terms of Service for its application at any time
          without notice. By using this application, you are agreeing to be bound by the then
          current version of these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and
          you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at
          support@tiktokapistreaming.com.
        </p>
      </div>
    </div>
  );
}
