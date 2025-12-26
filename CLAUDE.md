# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Purrify Dashboard is a modern Next.js 14 sales analytics dashboard for Purrify.ca with real-time data visualization, mobile-first design, and PWA capabilities. Built with TypeScript, Tailwind CSS, and a glassmorphic design aesthetic.

**Important Context:**
- This is the main dashboard application
- Authentication is currently **disabled for development** (see `src/middleware.ts` lines 40-42)
- Uses **mock data** for development; real integrations planned for Odoo ERP and Make.com
- All TypeScript strict mode checks are **enforced** - no `any` types or implicit returns allowed

## Essential Commands

### Development
```bash
npm run dev              # Start dev server at localhost:3000
npm run build            # Production build
npm run start            # Run production build
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint errors
npm run type-check       # TypeScript type checking (strict mode)
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

### Testing
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

### Performance & Analysis
```bash
npm run analyze          # Analyze bundle size (ANALYZE=true)
npm run clean            # Remove .next, out, dist
```

### Testing Individual Components
```bash
# Run single test file
npm test -- path/to/test-file.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="MetricCard"
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0+ (**strict mode enabled**)
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **State Management**: Zustand (auth) + React Query (data fetching)
- **Charts**: Chart.js + Recharts (dual approach for flexibility)
- **Animations**: Framer Motion
- **Authentication**: JWT with jose library (currently disabled in middleware)

### Directory Structure
```
src/
├── app/              # Next.js 14 App Router
│   ├── api/         # API routes (auth, dashboard, health, import)
│   ├── dashboard/   # Dashboard pages (/, /enhanced, /mobile, /sales, /analytics)
│   ├── login/       # Auth pages
│   ├── reports/     # Reports section
│   ├── settings/    # Settings pages
│   └── layout.tsx   # Root layout with providers
├── components/
│   ├── ui/          # Base UI components (22 files)
│   ├── layout/      # Layout components (sidebar, header, navigation)
│   ├── charts/      # Chart components
│   ├── forms/       # Form components
│   ├── mobile/      # Mobile-specific components
│   └── pwa/         # PWA-related components
├── lib/             # Utilities (analytics, cache, performance, react-query)
├── hooks/           # Custom hooks (dashboard-data, keyboard-shortcuts, mobile-gestures, pwa, realtime-data)
├── store/           # Zustand stores (auth-store.ts)
├── types/           # TypeScript type definitions (centralized in index.ts)
├── utils/           # Helper functions
├── styles/          # Global styles
└── middleware.ts    # Next.js middleware (auth protection - currently disabled)
```

### Path Aliases (tsconfig.json)
```typescript
"@/*"           → "./src/*"
"@/components/*" → "./src/components/*"
"@/lib/*"       → "./src/lib/*"
"@/hooks/*"     → "./src/hooks/*"
"@/store/*"     → "./src/store/*"
"@/types/*"     → "./src/types/*"
"@/utils/*"     → "./src/utils/*"
"@/styles/*"    → "./src/styles/*"
```

**Always use path aliases** (`@/`) instead of relative paths for imports.

## State Management Architecture

### Zustand for Auth
- **File**: `src/store/auth-store.ts`
- Manages user authentication state
- Persisted to localStorage with zustand/middleware
- Provides `login()`, `logout()`, `setUser()` actions
- **Usage**: `import { useAuthStore } from '@/store/auth-store'`

### React Query for Data
- **File**: `src/lib/react-query.ts` - Configured QueryClient
- Default stale time: 60 seconds
- No refetch on window focus (dashboard-specific optimization)
- 1 retry attempt
- Used for all dashboard metrics and chart data

### Data Flow Pattern

**API Routes → React Query → Components:**
```typescript
// 1. API Route (src/app/api/dashboard/metrics/route.ts)
export async function GET() {
  return NextResponse.json({ data: metrics })
}

// 2. Custom Hook (src/hooks/use-dashboard-data.ts)
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => fetch('/api/dashboard/metrics').then(r => r.json())
  })
}

// 3. Component Usage
const { data, isLoading } = useDashboardMetrics()
```

## Authentication Flow

**Current State**: Authentication is **DISABLED** for development
- See `src/middleware.ts` lines 40-42 for temporary bypass
- Protected routes: `/dashboard`, `/reports`, `/settings`, `/api/*`
- Demo credentials (when enabled): `admin@purrify.ca`, `manager@purrify.ca`
- JWT stored in cookies with httpOnly flag

**When working with auth:**
- Auth state managed by `useAuthStore()` from `@/store/auth-store`
- Token helpers: `getAuthToken()`, `isAuthenticated()` from auth-store
- Middleware protects routes automatically when enabled

## Design System

### Glassmorphic Theme
- **Primary colors**: Indigo/Purple gradients (#667eea → #764ba2), Teal (#1ABC9C)
- **Glass effects**: Tailwind utilities `.glass`, `.glass-strong`, `.glass-subtle`
- **Backdrop blur**: 10px-30px range
- **Custom glow effects**: `.glow-primary`, `.glow-secondary`

### Key Design Patterns
- **Metric Cards**: Glassmorphic with gradient borders, animated counters
- **Charts**: High contrast, animated transitions, interactive tooltips
- **Navigation**: Sidebar (desktop) + Bottom nav (mobile)
- **Animations**: Framer Motion for page transitions, CSS for micro-interactions

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Performance Optimizations

### Bundle Splitting (next.config.mjs)
- **React vendor chunk** (priority 20)
- **Charts chunk** (Chart.js + Recharts, priority 15)
- **UI chunk** (Framer Motion + Lucide, priority 15)
- **Common chunk** for shared code (priority 5)

### Code Splitting
- **Route-based**: Automatic via Next.js App Router
- **Component-based**: Use `lazy()` for heavy components
- **Dynamic imports**: For charts and visualizations

### Caching Strategy
- **API routes**: `no-store` (real-time data)
- **Static assets**: `max-age=31536000` (1 year)
- **React Query**: 60s stale time, background refetch

## TypeScript Configuration

**Strict mode is ENFORCED** - All strict compiler options enabled:
- `noImplicitAny`: true
- `strictNullChecks`: true
- `noUncheckedIndexedAccess`: true
- `exactOptionalPropertyTypes`: true
- `noImplicitReturns`: true

**Rules:**
- Never use `any` type - use `unknown` or specific types
- All function paths must return a value or `void`
- Handle null/undefined explicitly
- No non-null assertions (`!`) - use proper null checks

## Development Workflows

### Adding a New Feature

1. **Plan the feature** - Understand requirements and impacts
2. **Create types** - Add TypeScript interfaces to `src/types/index.ts`
3. **Build API route** - Add to `src/app/api/` if needed
4. **Create hook** - Add custom hook to `src/hooks/` for data fetching
5. **Build component** - Start with `src/components/ui/` for reusable pieces
6. **Add to page** - Integrate into appropriate `src/app/` page
7. **Style with Tailwind** - Use existing design tokens and utilities
8. **Add animations** - Use Framer Motion for page-level, CSS for micro-interactions
9. **Test thoroughly** - Unit tests + manual testing across devices

### Working with Charts

**Chart.js vs Recharts:**
- **Chart.js**: Line, bar, pie charts with complex animations
- **Recharts**: More declarative, easier responsive behavior
- Both available; choose based on requirements

**Chart Component Pattern:**
```typescript
// Use EnhancedChart wrapper for consistent styling
import { EnhancedChart } from '@/components/ui/enhanced-chart'

<EnhancedChart
  data={chartData}
  type="line"
  height={300}
  animated={true}
/>
```

### Mobile Development

**Mobile-First Approach:**
- Design mobile layout first
- Use Tailwind responsive classes: `md:`, `lg:`
- Test with Chrome DevTools device emulation
- Use custom hooks: `useMobileGestures()`, `usePWA()`

**PWA Features:**
- Service worker registered in `src/app/layout.tsx`
- Manifest at `public/manifest.json`
- Offline support via cache strategies
- Install prompts handled by `usePWA()` hook

### Styling Guidelines

**Tailwind Best Practices:**
- Use design tokens from `tailwind.config.ts`
- Prefer utility classes over custom CSS
- Use `@apply` sparingly in component styles
- Glassmorphic effects: `.glass`, `.glass-strong`
- Text gradients: `.text-gradient`, `.text-gradient-secondary`

**Component Patterns:**
```typescript
// Metric Card Example
<div className="glass rounded-xl p-6 transition-all hover:glass-strong">
  <div className="flex items-center justify-between">
    <div className="text-gradient text-4xl font-bold">{value}</div>
    <div className="glow-primary">{icon}</div>
  </div>
</div>
```

## Important Implementation Notes

### Next.js Configuration
- **Standalone output** for Docker deployment
- **SWC minification** enabled
- **React strict mode** enabled
- Console.log removal in production (except error/warn)
- Image optimization: WebP/AVIF formats

### Environment Variables

Create `.env.local` (reference `.env.example`):
```env
JWT_SECRET=your-secret-key
DATABASE_URL=your-db-url           # Future use
ODOO_API_KEY=your-odoo-key         # Future integration
MAKE_API_KEY=your-make-key         # Future integration
NEXT_PUBLIC_GA_ID=your-ga-id       # Analytics
```

### Common Pitfalls

1. **Import path issues** - Use path aliases (`@/`) not relative paths
2. **Client/Server components** - Mark client components with `'use client'` directive
3. **Type errors** - Don't ignore; strict mode is enforced
4. **Mock data** - Remember current data is mocked; real APIs coming later
5. **useEffect return paths** - All conditional paths must return cleanup function or undefined

### Security Considerations

- **XSS Protection**: Headers configured in `next.config.mjs`
- **CORS**: Middleware adds headers for API routes
- **JWT**: Use jose library for secure token handling
- **Input Validation**: Always validate API inputs
- **Rate Limiting**: To be implemented for production

## Testing Strategy

**Test Structure:**
- **Component tests**: React Testing Library
- **API tests**: Mock Service Worker (MSW)
- **E2E tests**: Playwright (if implemented)
- **Coverage target**: 80%+ minimum

**Testing Best Practices:**
- Test user interactions, not implementation details
- Use `screen.getByRole()` over `getByTestId()`
- Mock API calls with MSW
- Test loading and error states

## Current Limitations & Future Work

**Implemented but Mock:**
- Real-time WebSocket (uses `MockWebSocket` class simulation)
- Dashboard metrics (hardcoded in `/api/dashboard/metrics/route.ts`)
- Authentication (disabled in middleware for development)

**Not Yet Implemented:**
- Database integration (CSV import has `// TODO: Store this data in your database`)
- Odoo ERP integration
- Make.com automation workflows
- Real-time WebSocket server
- Advanced filtering and drill-down
- Export functionality (PDF, CSV) - infrastructure exists
- Social media widget integrations
- Custom dashboard layouts

**Testing Status:**
- Testing framework installed (Jest + React Testing Library)
- **No tests written yet** - critical gap to address

## Git Workflow

**Repository**: `https://github.com/aicoder88/purrify-dashboard.git`

**Branch**: `main`

**Commit Message Format:**
```
<type>: <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Pre-commit hooks** (Husky):
- Runs ESLint --fix on staged files
- Formats with Prettier
- Configured in `package.json` lint-staged

## Design Philosophy

**Key Principles:**
1. **Mobile-first** - Design for mobile, scale up to desktop
2. **Performance** - Sub-second load times, smooth 60fps animations
3. **Accessibility** - WCAG 2.1 AA compliance target
4. **Real-time** - Live data updates with smooth transitions
5. **Delightful UX** - Glassmorphic design with playful animations

**Code Quality:**
- TypeScript strict mode enforced
- ESLint and Prettier configured
- No `any` types (use `unknown` or specific types)
- Prefer composition over inheritance
- Keep components small and focused
