import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy | TikTok Stream',
  description: 'Privacy Policy for TikTok Stream application',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Last Updated: {new Date().toLocaleDateString()}
          </p>
          <p>
            This Privacy Policy describes how TikTok Stream (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) 
            collects, uses, and shares information when you use our application and services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">Information from Facebook</h3>
          <p>
            With your permission, we collect the following information from Facebook:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Public profile information</li>
            <li>Content from public posts, including comments and reactions</li>
            <li>Page information for pages you manage</li>
            <li>
              Temporary access tokens used to retrieve data on your behalf
              (these are never stored permanently)
            </li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6">How We Use This Information</h3>
          <p>
            We use the information collected to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our social media analysis tools</li>
            <li>Analyze content and engagement on your public posts</li>
            <li>Generate reports and insights about your social media presence</li>
            <li>Respond to your requests and provide customer support</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Retention and Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">How Long We Keep Your Data</h3>
          <p>
            We retain the information we collect for as long as necessary to provide our services,
            or until you request deletion of your data.
          </p>
          
          <h3 className="text-lg font-medium mt-6" id="data-deletion">Data Deletion Requests</h3>
          <p>
            You can request deletion of your data at any time by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Emailing us at <a href="mailto:privacy@yourdomain.com" className="text-primary hover:underline">
                privacy@yourdomain.com
              </a> with the subject line &quot;Data Deletion Request&quot;
            </li>
            <li>
              Including your name and the email address associated with your account
            </li>
            <li>
              Providing your Facebook User ID if possible (this helps us locate all your data)
            </li>
          </ul>
          
          <p className="mt-4">
            We will process your request within 30 days and notify you when complete. Upon receiving your request,
            we will delete all data associated with your account from our active systems and archives.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Changes to This Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <a href="mailto:privacy@yourdomain.com" className="text-primary hover:underline">
              privacy@yourdomain.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 