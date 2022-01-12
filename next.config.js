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
};
