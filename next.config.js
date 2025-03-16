/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    // Add rule to handle .proto files
    config.module.rules.push({
      test: /\.proto$/,
      type: 'asset/source',
    });

    return config;
  },
};

module.exports = nextConfig;
