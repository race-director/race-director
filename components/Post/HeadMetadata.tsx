import Head from "next/head";
import React from "react";
import { post } from "../../types";
import { toTitleCase } from "../../utils/other";

interface HeadMetadataProps {
  href: string;
  post: post;
}

const HeadMetadata: React.FC<HeadMetadataProps> = ({ href, post }) => {
  const getOptimizedImage = (url: string) => {
    return `/_next/image?url=${encodeURI(url)}&w=384&q=75`;
  };

  return (
    <Head>
      <meta name="title" content={toTitleCase(post.metadata.headline)} />
      <meta name="description" content={post.metadata.summary} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={href} />
      <meta property="og:title" content={toTitleCase(post.metadata.headline)} />
      <meta property="og:description" content={post.metadata.summary} />
      <meta
        property="og:image"
        content={getOptimizedImage(post.coverImage.coverImageUrl)}
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={href} />
      <meta
        property="twitter:title"
        content={toTitleCase(post.metadata.headline)}
      />
      <meta property="twitter:description" content={post.metadata.summary} />
      <meta
        property="twitter:image"
        content={getOptimizedImage(post.coverImage.coverImageUrl)}
      />
      <title>{toTitleCase(post.metadata.headline)}</title>
    </Head>
  );
};

export default HeadMetadata;
