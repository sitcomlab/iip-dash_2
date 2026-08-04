/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/bike_data/:path*',
        destination: 'https://ipdashboard.uni-muenster.de/bike_data/:path*',
      },
      {
        source: '/bicycle_infra/:path*',
        destination: 'https://ipdashboard.uni-muenster.de/bicycle_infra/:path*',
      },
    ];
  },
};

export default nextConfig;
