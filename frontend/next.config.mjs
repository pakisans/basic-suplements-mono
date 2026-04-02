/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '46.225.222.58',
        port: '3001',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: '46.225.222.58',
        port: '3001',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
