# Purrify Sales Dashboard

A modern, real-time analytics platform designed to provide comprehensive insights into sales performance, customer behavior, and business metrics for Purrify.ca.

## 🚀 Features

### Core Functionality
- **Real-time Data Visualization**: Live updates with smooth animations and interactive charts
- **Mobile-First Design**: Optimized for all screen sizes with PWA capabilities
- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Scalable Architecture**: Designed for future growth and easy maintenance

### Performance & Optimization ✨
- **Core Web Vitals Optimized**: Excellent LCP, FID, and CLS scores
- **Advanced Caching**: Multi-layer caching strategy (memory, storage, CDN)
- **Bundle Optimization**: Code splitting and tree shaking for minimal load times
- **Image Optimization**: WebP/AVIF support with lazy loading
- **Progressive Loading**: Skeleton screens and enhanced loading states

### Accessibility & UX ♿
- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: ARIA labels and live regions
- **Focus Management**: Proper focus trapping and restoration
- **Reduced Motion**: Respects user motion preferences

### Monitoring & Analytics 📊
- **Performance Monitoring**: Real-time Core Web Vitals tracking
- **Error Tracking**: Comprehensive error reporting with context
- **Analytics Integration**: Google Analytics 4, Mixpanel, Hotjar
- **Health Checks**: System health monitoring endpoints

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+
- **Animations**: Framer Motion 10+
- **Charts**: Chart.js 4.0+
- **State Management**: Zustand + React Query
- **Authentication**: JWT with middleware protection
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/purrify/dashboard.git
cd purrify-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Database URL (when implementing real database)
DATABASE_URL=your-database-url-here

# API Keys (for future integrations)
ODOO_API_KEY=your-odoo-api-key
MAKE_API_KEY=your-make-api-key

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔐 Authentication

The dashboard includes a complete authentication system with JWT tokens and middleware protection.

### Demo Credentials

- **Admin**: `admin@purrify.ca` (any password)
- **Manager**: `manager@purrify.ca` (any password)

### Protected Routes

- `/dashboard` - Main dashboard
- `/reports` - Reports section
- `/settings` - Settings page
- All `/api/*` routes except auth endpoints

## 📁 Project Structure

```
purrify-dashboard/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── login/             # Authentication pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── charts/           # Chart components
│   │   └── forms/            # Form components
│   ├── lib/                  # Utility libraries
│   ├── hooks/                # Custom React hooks
│   ├── store/                # State management (Zustand)
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles and design tokens
│   └── middleware.ts         # Next.js middleware
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.mjs          # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design System

The dashboard follows the Purrify design system with:

### Color Palette
- **Primary**: Charcoal (#2B2B2B)
- **Secondary**: Teal (#1ABC9C)
- **Success**: #27AE60
- **Warning**: #E67E22
- **Error**: #ef4444

### Typography
- **Font Family**: Inter
- **Scale**: 8px grid system
- **Weights**: 400, 500, 600, 700

### Components
- Consistent spacing and sizing
- Hover states and animations
- Mobile-responsive design
- Accessibility compliant (WCAG 2.1 AA)

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # Run TypeScript checks
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Performance & Deployment
npm run analyze         # Analyze bundle size
npm run clean           # Clean build artifacts
./scripts/deploy.sh     # Full production deployment
./scripts/performance-test.js  # Run performance tests

# Deployment Options
./scripts/deploy.sh --skip-tests      # Deploy without tests
./scripts/deploy.sh --analyze-bundle  # Deploy with bundle analysis
```

## 🚀 Performance Testing

Run comprehensive performance tests with automated reporting:

```bash
# Test local development
TEST_URL=http://localhost:3000 ./scripts/performance-test.js

# Test production
TEST_URL=https://dashboard.purrify.ca ./scripts/performance-test.js
```

The performance test generates:
- **HTML Report**: Visual performance dashboard
- **JSON Report**: Raw performance data
- **Screenshots**: Visual regression testing
- **Accessibility Report**: WCAG compliance check

Reports are saved to `performance-reports/` directory.

## 🏥 Health Monitoring

Monitor application health with built-in endpoints:

```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed health check
curl -X POST http://localhost:3000/api/health \
  -H "Content-Type: application/json" \
  -d '{"includeDetails": true}'
```

Health checks monitor:
- Database connectivity
- Cache performance
- Memory usage
- System resources

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and component integration
- **Coverage**: Minimum 80% coverage target

Run tests:

```bash
npm run test
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build Docker image
docker build -t purrify-dashboard .

# Run container
docker run -p 3000:3000 purrify-dashboard
```

## 📈 Performance

The dashboard is optimized for performance:

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Size**: Optimized with code splitting
- **Images**: Next.js Image optimization
- **Caching**: Aggressive caching strategies

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `DATABASE_URL` | Database connection string | No* |
| `ODOO_API_KEY` | Odoo ERP API key | No* |
| `MAKE_API_KEY` | Make.com API key | No* |

*Required for production with real integrations

### Customization

The dashboard is highly customizable:

- **Colors**: Update `tailwind.config.ts` and design tokens
- **Components**: Extend base components in `/src/components/ui`
- **Layout**: Modify layout components for different structures
- **Charts**: Add new chart types in `/src/components/charts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write tests for new features
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub
- **Email**: support@purrify.ca

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] Design system implementation
- [x] Authentication framework
- [x] Basic layout and navigation

### Phase 2: Core Dashboard ✅
- [x] Metric cards and KPIs
- [x] Data integration layer
- [x] Basic filtering and search

### Phase 3: Data Visualization ✅
- [x] Chart.js integration
- [x] Real-time data updates
- [x] Interactive dashboards

### Phase 4: Mobile Optimization ✅
- [x] PWA implementation
- [x] Mobile-specific features
- [x] Offline functionality

### Phase 5: Performance & Polish ✅
- [x] Performance optimizations (Core Web Vitals)
- [x] Bundle size optimization and code splitting
- [x] Image optimization and lazy loading
- [x] Comprehensive caching strategies
- [x] Enhanced error boundaries and loading states
- [x] WCAG 2.1 AA accessibility compliance
- [x] Analytics and monitoring integration
- [x] Production deployment scripts
- [x] Performance testing automation
- [x] SEO optimization
- [x] Security hardening

---

Built with ❤️ by the Purrify Team
