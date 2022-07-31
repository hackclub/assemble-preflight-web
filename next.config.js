/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  },
  async redirects() {
    return [
      {
        source: '/set/:path',
        destination: 'https://id.assemble.hackclub.com/set/:path',
        permanent: true,
      },
      {
        source: '/signout',
        destination: '/api/signout',
        permanent: false
      }
    ]
  },
}

module.exports = nextConfig
