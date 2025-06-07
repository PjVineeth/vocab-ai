/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/Speech_model_conv_pipeline_1805_/templates/:path*',
        destination: '/Speech_model_conv_pipeline_1805_/templates/:path*',
      },
    ];
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig; 