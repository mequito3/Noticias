/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Desactiva errores de ESLint en el build
  },
  output: "export",
  basePath: "/Noticias",
  assetPrefix: "/Noticias/",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
