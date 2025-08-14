// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ['api.qrserver.com'], // Esta linha foi substituída
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        // Opcional: Se houver um port específico, você pode adicioná-lo aqui.
        // port: '',
        // Opcional: Se a imagem estiver em um subcaminho específico, você pode defini-lo.
        // pathname: '/v1/**',
      },
    ],
  },
};

export default nextConfig;
