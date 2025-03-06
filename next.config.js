/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // basePath: "/NotisApp", // Comentado para solucionar el error 404
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
