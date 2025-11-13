/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    runtime: 'nodejs',
  },
  // Opcional: evita que Next.js intente usar Edge Runtime
  output: 'standalone',
};

export default nextConfig;
