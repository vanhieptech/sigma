# TikTok Stream Manager

A comprehensive management platform for TikTok creators to monitor streams, manage content, analyze performance, and boost audience engagement.

## Features

- **Real-time Stream Management:** Monitor and control live streams with intuitive controls
- **Analytics Dashboard:** Track performance metrics with detailed visualizations
- **Content Management:** Schedule and organize your TikTok content calendar
- **Audience Engagement:** Manage comments and interact with viewers
- **Monetization Tracking:** Monitor revenue streams and analyze earning patterns
- **TikTok API Integration:** Connect your TikTok account to access enhanced features

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, API Routes (Next.js)
- **Authentication:** NextAuth.js, TikTok OAuth
- **Data Visualization:** Recharts, D3.js
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- TikTok Developer Account (for API access)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/tiktok-stream-manager.git
cd tiktok-stream-manager
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/tiktok/callback
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## TikTok API Integration

This project leverages the TikTok API to enhance the functionality of the Stream Manager. To set up the TikTok API integration:

1. Register a developer account at [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new application in the TikTok Developer Portal
3. Configure OAuth redirect URLs to include your callback URL
4. Obtain your Client Key and Client Secret
5. Follow the detailed setup instructions in [Setup Guide](./src/app/api-submission/setup-guide.md)

### API Utilities

The project includes a comprehensive TikTok API utility (`/src/lib/tiktok-api.ts`) that provides the following functions:

- Authentication and token management
- User profile data retrieval
- Video listing and management
- Comment fetching and posting
- Analytics data access

## Project Structure

```
tiktok-stream/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── analytics/    # Analytics dashboard
│   │   ├── dashboard/    # Main dashboard
│   │   ├── api-test/     # TikTok API test page
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── tiktok-auth-button.tsx # TikTok authentication button
│   │   └── ...
│   ├── lib/              # Utility functions
│   │   ├── tiktok-api.ts # TikTok API integration
│   │   └── ...
│   └── ...
├── .env.local            # Environment variables (not in repo)
└── ...
```

## Testing the TikTok API Integration

To test the TikTok API integration:

1. Ensure your environment variables are set up correctly
2. Navigate to `/api-test` in your browser
3. Click the "Connect TikTok" button
4. Authorize the application on TikTok
5. You'll be redirected back to the test page where you can explore API functionality

## Development

### Component Guidelines

- Use functional components with TypeScript interfaces
- Implement responsive design with Tailwind CSS
- Follow the project's established patterns for new components

### API Integration Guidelines

- All TikTok API calls should use the utility functions in `tiktok-api.ts`
- Implement proper error handling for API failures
- Cache API responses when appropriate to reduce rate limiting issues

## Deployment

The application can be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the required environment variables
3. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TikTok for providing the API
- The Next.js team for the amazing framework
- The open-source community for the tools and libraries used in this project
