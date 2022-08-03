/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
  pwa: {
    dest: 'public',
    swSrc: 'sw.js',
  },
  async redirects() {
    return [
      {
        source: "/set/:path",
        destination: "https://id.assemble.hackclub.com/set/:path",
        permanent: true,
      },
      {
        source: "/signout",
        destination: "/api/signout",
        permanent: false,
      },
    ];
  },
});

module.exports = nextConfig;
