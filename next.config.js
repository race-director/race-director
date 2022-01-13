/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/p",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
    formats: ["image/avif", "image/webp"],
  },
};
