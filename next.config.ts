import withBundleAnalyzer from '@next/bundle-analyzer';
import './src/libs/Env';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
export default
  bundleAnalyzer(
    {
      eslint: {
        dirs: ['.'],
        ignoreDuringBuilds: true
      },
      poweredByHeader: false,
      reactStrictMode: true
    },
  );

