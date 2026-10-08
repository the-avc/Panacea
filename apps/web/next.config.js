/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:4000; frame-ancestors 'none';",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/services/notice-13-2',
        destination: '/services/sarfaesi/notice-13-2',
      },
      {
        source: '/services/section-14',
        destination: '/services/sarfaesi/section-14',
      },
      {
        source: '/services/possession-execution',
        destination: '/services/sarfaesi/possession-execution',
      },
      {
        source: '/services/third-party',
        destination: '/services/investigation/third-party',
      },
      {
        source: '/services/asset-verification',
        destination: '/services/investigation/asset-verification',
      },
    ];
  },
};

module.exports = nextConfig;
