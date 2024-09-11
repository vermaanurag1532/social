/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)', // Apply to all routes
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin-allow-popups', // Adjust policy as needed
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  