import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Deletion Request | TikTok Stream',
  description: 'Request deletion of your data from TikTok Stream',
};

export default function DataDeletionPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Data Deletion Request</h1>
      <p className="text-muted-foreground mb-8">
        Information about how to request deletion of your data from our systems
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How to Request Data Deletion</CardTitle>
          <CardDescription>
            Follow these steps to request deletion of data we&apos;ve collected through our Facebook
            app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In compliance with Facebook&apos;s Platform Policies and privacy regulations, we provide
            a way for you to request deletion of your data from our systems.
          </p>

          <h3 className="text-lg font-medium mt-6">Step 1: Submit a Request</h3>
          <p>
            Send an email to{' '}
            <a href="mailto:privacy@yourdomain.com" className="text-primary hover:underline">
              privacy@yourdomain.com
            </a>{' '}
            with the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Subject line: &quot;Data Deletion Request&quot;</li>
            <li>Your full name</li>
            <li>The email address associated with your account</li>
            <li>Your Facebook User ID (if you know it)</li>
            <li>Any additional information that might help us identify your data</li>
          </ul>

          <h3 className="text-lg font-medium mt-6">Step 2: Verification</h3>
          <p>
            We may need to verify your identity to ensure we&apos;re deleting the correct data.
            We&apos;ll respond to your email with any additional information needed.
          </p>

          <h3 className="text-lg font-medium mt-6">Step 3: Confirmation</h3>
          <p>
            Once we&apos;ve processed your request, we&apos;ll send you a confirmation email
            indicating that all your data has been deleted from our systems.
          </p>

          <div className="bg-muted p-4 rounded-md mt-6">
            <p className="text-sm font-medium">Processing Time</p>
            <p className="text-sm">
              We will process all deletion requests within 30 days, though most requests are
              completed much sooner.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Data We Delete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>When you request data deletion, we will remove:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any personal information collected from Facebook</li>
            <li>Content from posts and comments we&apos;ve analyzed</li>
            <li>Analysis results and reports connected to your account</li>
            <li>Any stored tokens or credentials</li>
          </ul>

          <p className="mt-4">
            For more information about the data we collect and how we use it, please refer to our
            <Link href="/privacy-policy" className="text-primary hover:underline ml-1">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
