# Stack Information

## Frontend (kostfind_web)

### Core Stack
- **Framework**: React 19
- **Language**: TypeScript 5.x
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.3.1

### UI Libraries
- **Icons**: Lucide React
- **Animation**: Framer Motion

### State & Data
- **State Management**: Zustand
- **API Client**: Axios
- **Realtime**: Socket.IO Client

### Auth
- **Method**: JWT Bearer Token
- **Storage**: localStorage
- **Interceptor**: Axios interceptor for auth header

## Backend (kostfind_api)

### Core Stack
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Hosting**: Railway

### Auth
- **Method**: JWT + Passport
- **Strategy**: Bearer token

## Commands

```bash
# Development
npm run dev          # Start Vite dev server

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Quality
npm run lint         # ESLint
npm run type-check   # TypeScript check

# Test
npm test             # Run tests
```

## Design System

See: `/design-system/MASTER.md`

### Brand Colors
- Primary: #004ac6 (Blue Trust)
- Secondary: #006c49 (Green Safe)
- Warning: #f59e0b (Amber)
- Danger: #ba1a1a (Red)
