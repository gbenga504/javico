import React from "react";
import Helmet from "react-helmet";

interface IProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const Seo: React.FC<IProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterDescription,
  twitterTitle,
  twitterImage
}) => {
  return (
    <Helmet>
      {/* General tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* OpenGraph tags */}
      <meta name="og:url" content={ogUrl} />
      <meta name="og:title" content={ogTitle || title} />
      <meta name="og:description" content={ogDescription || description} />
      <meta name="og:image" content={ogImage} />
      <meta name="og:type" content="website" />
      {/* Twitter Card tags */}
      <meta name="twitter:title" content={twitterTitle || ogTitle} />
      <meta
        name="twitter:description"
        content={twitterDescription || ogDescription}
      />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
};

export default Seo;
