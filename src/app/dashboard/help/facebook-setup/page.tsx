import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facebook App Setup Guide',
  description: 'Learn how to set up a Facebook App for authentication and API access',
};

export default function FacebookSetupPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Facebook App Setup Guide</h1>
      <p className="text-muted-foreground mb-8">
        Follow these steps to create a Facebook App and get your App ID for authentication
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            What you'll need before getting started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>A Facebook account</li>
            <li>A verified business email address</li>
            <li>A phone number for verification (if required)</li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 1: Create a Facebook Developer Account</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook for Developers</a>
            </li>
            <li>
              Click on "Get Started" or "Log In" in the top-right corner
            </li>
            <li>
              Log in with your Facebook account
            </li>
            <li>
              Complete the registration process if you haven't already registered as a developer
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 2: Create a New App</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              From the Facebook for Developers dashboard, click on "My Apps" in the top-right corner
            </li>
            <li>
              Click on "Create App"
            </li>
            <li>
              Select "Consumer" as the app type
            </li>
            <li>
              Fill in the app details:
              <ul className="list-disc pl-6 mt-2">
                <li>App Name: Choose a name for your app (e.g., "My Facebook Crawler")</li>
                <li>App Contact Email: Enter your email address</li>
                <li>Business Account: Select a business account if you have one, or create a new one</li>
              </ul>
            </li>
            <li>
              Click "Create App" to proceed
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 3: Add Facebook Login Product</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              In your app dashboard, find the "Add Products to Your App" section
            </li>
            <li>
              Find "Facebook Login" and click "Set Up"
            </li>
            <li>
              Select "Web" as the platform
            </li>
            <li>
              Enter your website URL (e.g., "https://yourdomain.com" or "http://localhost:3000" for local development)
            </li>
            <li>
              Click "Save" and then "Continue"
            </li>
            <li>
              You can skip the next steps in the quick start guide for now
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 4: Configure Facebook Login Settings</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              In the left sidebar, click on "Facebook Login" and then "Settings"
            </li>
            <li>
              Add the following URLs to the "Valid OAuth Redirect URIs" field:
              <ul className="list-disc pl-6 mt-2">
                <li>https://yourdomain.com/dashboard/crawlers/facebook (replace with your actual domain)</li>
                <li>http://localhost:3000/dashboard/crawlers/facebook (for local development)</li>
              </ul>
            </li>
            <li>
              Click "Save Changes"
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Step 5: Get Your App ID</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              In the left sidebar, click on "Settings" and then "Basic"
            </li>
            <li>
              Here you'll find your "App ID" - this is what you need for the Facebook Login button
            </li>
            <li>
              Copy this App ID and add it to your .env.local file:
              <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto">
                <code>NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here</code>
              </pre>
            </li>
          </ol>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step 6: Configure App Permissions</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              In the left sidebar, click on &quot;App Review&quot; and then &quot;Permissions and Features&quot;
            </li>
            <li>
              Look for the following permissions (search for them in the search bar if needed):
              <ul className="list-disc pl-6 mt-2">
                <li><strong>pages_read_engagement</strong> - To access engagement metrics for Pages</li>
                <li><strong>pages_show_list</strong> - To see the list of Pages a person manages</li>
                <li><strong>pages_manage_posts</strong> - To access post content on Pages</li>
                <li><strong>public_profile</strong> - Basic permission for user profiles</li>
                <li><strong>email</strong> - To access the user&apos;s email address</li>
              </ul>
            </li>
            <li>
              For each permission, click &quot;Request&quot; or &quot;Add to Submission&quot;
            </li>
            <li>
              You&apos;ll need to explain how your app will use each permission. Be specific about:
              <ul className="list-disc pl-6 mt-2">
                <li>Why your app needs this data</li>
                <li>How it benefits the user</li>
                <li>How you&apos;ll use and display the data</li>
              </ul>
            </li>
            <li>
              <strong>Important note about permissions:</strong> If you cannot find a specific permission, try:
              <ul className="list-disc pl-6 mt-2">
                <li>Using the search functionality in the Permissions page</li>
                <li>Looking under different categories (Graph API, Marketing API, etc.)</li>
                <li>Checking the <a href="https://developers.facebook.com/docs/permissions/reference/" className="text-primary hover:underline" target="_blank">Facebook Permissions Reference</a> for the most up-to-date list</li>
              </ul>
            </li>
            <li>
              When testing your app, note that some permissions only work in Live mode after approval, but &quot;pages_read_engagement&quot; and &quot;pages_show_list&quot; should be available for testing with developer accounts
            </li>
          </ol>
        </section>
      </div>
      
      <Alert className="mt-8">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          While your app is in development mode, it will only work for users who are added as developers or testers. To make it available to all users, you'll need to complete the App Review process and set your app to Live mode.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Adding Required Privacy Policy and Data Deletion Information</CardTitle>
          <CardDescription>
            Before switching to live mode, Facebook requires privacy policy and data deletion information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">Why This Is Required</h3>
            <p className="mb-4">
              Facebook requires all apps to have a privacy policy and data deletion instructions to protect user privacy
              and comply with various privacy regulations (like GDPR, CCPA).
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">Step 1: Create a Privacy Policy</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                Create a privacy policy page on your website that includes:
                <ul className="list-disc pl-6 mt-2">
                  <li>What data your app collects from Facebook</li>
                  <li>How you use and store this data</li>
                  <li>How long you retain the data</li>
                  <li>How users can contact you regarding their data</li>
                  <li>How users can request data deletion</li>
                </ul>
              </li>
              <li>
                If you don&apos;t have a website, you can use a privacy policy generator service or create a simple
                GitHub page to host your privacy policy.
              </li>
              <li>
                <strong>We&apos;ve created templates for you:</strong> You can use our 
                <Link href="/privacy-policy" className="text-primary hover:underline mx-1" target="_blank">
                  privacy policy
                </Link>
                and
                <Link href="/data-deletion" className="text-primary hover:underline mx-1" target="_blank">
                  data deletion
                </Link>
                pages as templates. Just customize them with your information.
              </li>
            </ol>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">Step 2: Add Privacy Policy to Your App</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                In the left sidebar of your App Dashboard, click on &quot;Settings&quot; and then &quot;Basic&quot;
              </li>
              <li>
                Scroll down to the &quot;Privacy Policy URL&quot; field
              </li>
              <li>
                Enter the full URL to your privacy policy (e.g., https://yourdomain.com/privacy-policy)
              </li>
              <li>
                Click &quot;Save Changes&quot;
              </li>
            </ol>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium mb-2">Step 3: Add Data Deletion Instructions</h3>
            <ol className="list-decimal pl-6 space-y-4">
              <li>
                Still in the Basic Settings page, find the &quot;Data Deletion Instructions URL&quot; section
              </li>
              <li>
                You have two options:
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    <strong>URL option:</strong> Provide a URL to a page that explains how users can request data deletion
                    (can be a section in your privacy policy)
                  </li>
                  <li>
                    <strong>Instructions option:</strong> Directly type instructions explaining how users can request
                    their data be deleted from your app (such as an email address to contact)
                  </li>
                </ul>
              </li>
              <li>
                Complete the chosen option and click &quot;Save Changes&quot;
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Example Data Deletion Instructions</h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                &quot;To request deletion of your data collected through our app, please email 
                privacy@yourdomain.com with the subject line &apos;Data Deletion Request&apos;. 
                Include your Facebook User ID if possible. We will process your request within 
                30 days and notify you when complete.&quot;
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Link href="/dashboard/crawlers/facebook" className="text-primary hover:underline">
          ← Back to Facebook Crawler
        </Link>
      </div>
    </div>
  );
} 