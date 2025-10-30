import './globals.css';
import type { Metadata } from 'next';
import { PERSONAL_INFO } from '@/constants';

export const metadata: Metadata = {
  title: `${PERSONAL_INFO.name} | ${PERSONAL_INFO.title}`,
  description: PERSONAL_INFO.description,
  keywords: [
    'AI', 'Machine Learning', 'React', 'Next.js', 'TypeScript', 'Full Stack Developer', 
    'Portfolio', 'Data Science', 'Neural Networks', 'Deep Learning', 'JavaScript',
    'Python', 'Web Development', 'Software Engineer', 'Frontend', 'Backend'
  ],
  authors: [{ name: PERSONAL_INFO.name }],
  creator: PERSONAL_INFO.name,
  publisher: PERSONAL_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourportfolio.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com', // Update with your actual domain
    title: `${PERSONAL_INFO.name} | ${PERSONAL_INFO.title}`,
    description: PERSONAL_INFO.description,
    siteName: `${PERSONAL_INFO.name} Portfolio`,
    images: [
      {
        url: '/profile/profile.jpg',
        width: 1200,
        height: 630,
        alt: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PERSONAL_INFO.name} | ${PERSONAL_INFO.title}`,
    description: PERSONAL_INFO.description,
    images: ['/profile/profile.jpg'],
    creator: '@yourtwitterhandle', // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: PERSONAL_INFO.name,
              jobTitle: PERSONAL_INFO.title,
              description: PERSONAL_INFO.description,
              url: 'https://yourportfolio.com', // Update with your actual domain
              image: 'https://yourportfolio.com/profile/profile.jpg', // Update with your actual domain
              sameAs: [
                'https://github.com/7236alok',
                'https://linkedin.com/in/alok-yadav-81731425b',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'React',
                'Next.js',
                'TypeScript',
                'Python',
                'Data Science',
                'Web Development'
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#0f172a] text-white w-full">{children}</body>
    </html>
  );
}
