/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'chart.js',
    ],
    // Enable server components logging
    serverComponentsExternalPackages: ['sharp'],
    // Enable partial prerendering
    ppr: false,
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    // Enable emotion for better CSS-in-JS performance
    emotion: true,
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add Tempo plugin for development
    if (dev && !isServer) {
      try {
        const { tempo } = require('tempo-devtools/next');
        config.plugins.push(tempo());
      } catch (error) {
        console.warn('Tempo devtools not available:', error.message);
      }
    }
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|recharts|react-chartjs-2)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
          ui: {
            test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      };

      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Add custom webpack rules
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Add performance hints
    if (!dev) {
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  // Output configuration for deployment
  output: 'standalone',

  // Trailing slash configuration
  trailingSlash: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,
};

export default nextConfig;
