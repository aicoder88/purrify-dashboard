# PURRDASH Improvements

**Type:** Next.js 14 - Sales Analytics Dashboard
**Production Ready:** No (38%)

## Summary
Real-time business intelligence platform with mobile-first design. Well-structured but authentication completely disabled and zero test coverage.

## Critical Fixes

| Priority | Issue | File | Fix |
|----------|-------|------|-----|
| CRITICAL | Auth disabled | `src/middleware.ts:44-46` | Uncomment JWT verification logic |
| CRITICAL | Mock auth | `src/store/auth-store.ts:28` | Replace with real authentication |
| CRITICAL | CORS open to all | `src/middleware.ts:100` | Restrict to specific origins |
| HIGH | `any` types | 14+ files | Replace with specific interfaces |
| HIGH | Missing returns | `offline-indicator.tsx:30`, `vibrant-metric-card.tsx:68` | Add return statements |
| HIGH | Zero tests | Entire project | Set up Jest, write 80%+ coverage |
| MEDIUM | No input validation | API routes | Add Zod schemas |
| MEDIUM | WebSocket mock | `src/hooks/use-realtime-data.ts` | Implement real WebSocket |

## Specific Tasks

### 1. Enable Authentication (4 hours)
```typescript
// In src/middleware.ts, uncomment lines 48-73
// Add proper JWT verification
```

### 2. Fix TypeScript Errors (2 hours)
- Run `npx tsc --noEmit` to find all errors
- Replace `any` with proper types in `types/index.ts`

### 3. Create Jest Config (1 hour)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
# Create jest.config.js
```

### 4. Database Integration (2 days)
- Design schema for metrics, sales_data
- Add Prisma ORM
- Update API routes

## Recommended Tooling

```bash
# Testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Type safety
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# API validation
npm install zod
```
