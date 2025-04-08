import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({ 
  title = 'JALWA - #1 Color Prediction Platform | WinGo & TRX Hash VIP Signals',
  description = 'Get 99% accurate WinGo & TRX Hash color predictions with JALWA\'s advanced AI algorithm. Earn big with real-time predictions across multiple time intervals.',
  keywords = 'wingo, wingo ai, wingo hack, color prediction, earning, trx hash, trx win, wingo prediction, Ai Prediction, VIP signals',
  ogImage = '/generated-icon.png',
  ogUrl = 'https://jalwaprediction.com/',
  structuredData
}) => {
  // Convert structured data to string if it exists
  const structuredDataString = structuredData 
    ? JSON.stringify(structuredData) 
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JALWA Prediction Platform",
        "url": "https://jalwaprediction.com",
        "description": "Advanced prediction platform for WinGo and TRX Hash color games with 99% accuracy.",
        "applicationCategory": "GameApplication",
        "genre": "Prediction",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1256"
        }
      });

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">{structuredDataString}</script>
    </Helmet>
  );
};

export default SEO;