# Linkify Client Architecture

## 📁 Project Structure

```
client/
├── public/                     # Static assets
│   ├── logo.png
│   ├── favicon.ico
│   └── manifest.json
│
└── src/
    ├── app/                    # Core application setup
    │   ├── main.jsx            # Application entry point
    │   ├── index.js            # Re-exports
    │   ├── config/             # Configuration
    │   │   ├── envConfig.js    # Environment variables
    │   │   ├── roles.js        # User roles & permissions
    │   │   └── index.js
    │   ├── providers/          # Context providers
    │   │   ├── AuthProvider.jsx    # Authentication context
    │   │   ├── ThemeProvider.jsx   # Theme (dark/light) context
    │   │   ├── QueryProvider.jsx   # React Query setup
    │   │   └── index.js
    │   └── routes/             # Routing configuration
    │       ├── AppRoutes.jsx       # Main router
    │       ├── PrivateRoutes.jsx   # Protected routes
    │       ├── FreelancerRoutes.jsx # Freelancer-only routes
    │       ├── ClientRoutes.jsx     # Client-only routes
    │       └── index.js
    │
    ├── api/                    # Backend communication
    │   ├── axiosInstance.js    # Axios configuration
    │   ├── endpoints/          # API endpoint constants
    │   │   ├── auth.js
    │   │   ├── jobs.js
    │   │   ├── proposals.js
    │   │   ├── payments.js
    │   │   ├── users.js
    │   │   ├── messaging.js
    │   │   └── index.js
    │   ├── authApi.js          # Authentication API calls
    │   ├── jobsApi.js          # Jobs API calls
    │   ├── proposalsApi.js     # Proposals API calls
    │   ├── paymentsApi.js      # Payments API calls
    │   ├── usersApi.js         # Users API calls
    │   └── index.js
    │
    ├── components/             # Reusable UI components
    │   ├── ui/                 # Atomic design system components
    │   │   ├── button.jsx
    │   │   ├── input.jsx
    │   │   ├── card.jsx
    │   │   ├── label.jsx
    │   │   ├── badge.jsx
    │   │   ├── modal.jsx
    │   │   └── table.jsx
    │   ├── layout/             # Layout components
    │   │   ├── Navbars.jsx
    │   │   ├── Footer.jsx
    │   │   └── (future: Sidebar, DashboardLayout)
    │   ├── forms/              # Form components
    │   │   └── (future: LoginForm, JobPostForm, etc.)
    │   ├── cards/              # Card components
    │   │   └── (future: JobCard, ProfileCard, etc.)
    │   └── common/             # Common components
    │       └── (future: Loader, EmptyState, Pagination)
    │
    ├── features/               # Feature-based modules
    │   ├── auth/               # Authentication feature
    │   │   ├── pages/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── CompleteProfile.jsx
    │   │   │   └── GoogleCallback.jsx
    │   │   ├── hooks/          # (future: useAuth hook)
    │   │   └── validation/     # (future: validation schemas)
    │   │
    │   ├── dashboard/
    │   │   └── Dashboard.jsx
    │   │
    │   ├── jobs/               # Jobs feature
    │   │   ├── pages/          # (future: JobListing, JobDetail)
    │   │   └── components/     # (future: JobCard, FilterSidebar)
    │   │
    │   ├── proposals/          # Proposals feature
    │   │   ├── pages/          # (future)
    │   │   └── components/     # (future)
    │   │
    │   ├── messaging/          # Messaging feature
    │   │   ├── pages/          # (future)
    │   │   └── components/     # (future)
    │   │
    │   ├── payments/           # Payments feature
    │   │   ├── pages/          # (future)
    │   │   └── components/     # (future)
    │   │
    │   ├── settings/           # Settings feature
    │   │   └── (future)
    │   │
    │   └── skills/             # Skills feature
    │       └── (future)
    │
    ├── hooks/                  # Global custom hooks
    │   └── (future: useFetch, useNotifications, etc.)
    │
    ├── services/               # External service integrations
    │   ├── aiService.js        # AI/OpenAI integration
    │   ├── paymentService.js   # JazzCash/Easypaisa
    │   ├── chatService.js      # Socket.io wrapper
    │   ├── notificationService.js # Notification manager
    │   └── index.js
    │
    ├── store/                  # State management (Redux)
    │   ├── store.js            # Redux store configuration
    │   └── slices/
    │       └── authSlice.js    # Auth state slice
    │
    ├── styles/                 # Global styles
    │   └── globals.css         # TailwindCSS + custom styles
    │
    ├── utils/                  # Utility functions
    │   ├── tokenManager.js     # JWT token management
    │   ├── validation.js       # Validation helpers
    │   └── (future: formatDate, constants, etc.)
    │
    ├── assets/                 # Static assets
    │   ├── images/
    │   ├── icons/
    │   └── logos/
    │
    └── i18n/                   # Internationalization
        └── (future: en/, ur/)
```

## 🏗️ Architecture Principles

### 1. Feature-Based Modular Design
- Each feature is self-contained in `/features/`
- Features contain: pages, components, hooks, validation
- No cross-feature imports - use `/components`, `/services`, or `/hooks`

### 2. Layered Architecture

**Presentation Layer** (Components & Pages)
- React components focused on UI rendering
- Minimal business logic
- Use hooks for state and side effects

**Business Logic Layer** (Services)
- External integrations (AI, payments, chat)
- Complex business logic
- Reusable across features

**Data Layer** (API & Store)
- API calls via axios
- Global state via Redux Toolkit
- Server state via React Query

**Configuration Layer** (App/Config)
- Environment variables
- Feature flags
- User roles & permissions

### 3. Component Hierarchy

```
Atomic Design System:
/components/ui/        → Atoms (Button, Input, Badge)
/components/forms/     → Molecules (LoginForm, JobPostForm)
/components/layout/    → Organisms (Navbar, Sidebar, Footer)
/features/*/pages/     → Templates & Pages
```

### 4. State Management Strategy

**Local State** → useState, useReducer
**Global State** → Redux Toolkit (auth, persistent data)
**Server State** → React Query (API data, caching)
**UI State** → Context API (theme, notifications)

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (via *Api.js)
    ↓
Axios Instance (interceptors)
    ↓
Backend Server
    ↓
Response
    ↓
React Query Cache / Redux Store
    ↓
Component Re-render
```

## 🎨 Design System

### Colors (TailwindCSS)
```javascript
brand: {
  light: "#CAD2C5",     // Backgrounds, cards
  DEFAULT: "#84A98C",   // Buttons, accents
  dark: "#52796F",      // Hover, links
  deeper: "#354F52",    // Navigation, headings
  deepest: "#2F3E46",   // Footer, text
}
```

### Component Standards
- All UI components in `/components/ui/`
- Follow Linkify color scheme
- Support dark mode (use `dark:` classes)
- Accessible (ARIA labels, keyboard navigation)
- Responsive (mobile-first approach)

## 🔐 Authentication Flow

```
1. User logs in → authApi.login()
2. Server returns JWT token
3. Token stored via tokenManager.js
4. Token included in all API requests (axios interceptor)
5. AuthProvider provides user context
6. PrivateRoutes protect authenticated pages
7. Role-based routes (FreelancerRoutes, ClientRoutes)
```

## 📡 API Integration

### Endpoint Organization
```javascript
// Define endpoints as constants
const JOBS_ENDPOINTS = {
  GET_ALL_JOBS: '/jobs',
  GET_JOB_BY_ID: (id) => `/jobs/${id}`,
};

// Use in API files
const getAllJobs = async (params) => {
  return await axiosInstance.get(JOBS_ENDPOINTS.GET_ALL_JOBS, { params });
};
```

### API Call Pattern
```javascript
// In component
import { jobsApi } from '../api';
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => jobsApi.getAllJobs(),
});
```

## 🎯 Feature Module Structure

```
features/[feature-name]/
├── pages/              # Feature pages
│   ├── List.jsx
│   └── Detail.jsx
├── components/         # Feature-specific components
│   ├── Card.jsx
│   └── Form.jsx
├── hooks/              # Feature-specific hooks
│   └── useFeature.js
└── validation/         # Validation schemas
    └── schemas.js
```

## 🛠️ Development Guidelines

### Component Creation
```javascript
// Functional component with proper naming
const JobCard = ({ job, onApply }) => {
  return (
    <div className="bg-white dark:bg-brand-deepest rounded-lg p-6">
      {/* Component content */}
    </div>
  );
};

export default JobCard;
```

### Custom Hooks
```javascript
// Custom hook for data fetching
const useJobs = (filters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getAllJobs(filters),
  });
};

export default useJobs;
```

### API Integration
```javascript
// API file pattern
import axiosInstance from './axiosInstance';
import { JOBS_ENDPOINTS } from './endpoints';

const jobsApi = {
  getAllJobs: async (params = {}) => {
    const response = await axiosInstance.get(
      JOBS_ENDPOINTS.GET_ALL_JOBS,
      { params }
    );
    return response.data;
  },
};

export default jobsApi;
```

## 🚀 Performance Optimization

1. **Code Splitting** → Lazy load routes and features
2. **React Query Caching** → Reduce API calls
3. **Memoization** → useMemo, useCallback for expensive operations
4. **Image Optimization** → Lazy loading, proper sizing
5. **Bundle Size** → Tree-shaking, dynamic imports

## 🌐 Routing Structure

```
/                           → Home (public)
/auth/login                 → Login
/auth/register              → Register
/auth/complete-profile      → Profile setup

/jobs                       → Job listings (public)
/jobs/:id                   → Job details (public)

/freelancer/                → Freelancer routes (protected)
├── /dashboard              → Freelancer dashboard
├── /profile                → Profile management
├── /my-jobs                → Applied/saved jobs
└── /wallet                 → Earnings & wallet

/client/                    → Client routes (protected)
├── /dashboard              → Client dashboard
├── /post-job               → Create job
├── /manage-jobs            → Manage jobs
└── /payments               → Payment management

/messages                   → Chat (protected)
/proposals                  → Proposals (protected)
/settings                   → Settings (protected)
```

## 📦 Key Dependencies

- **React** → UI library
- **React Router** → Routing
- **Redux Toolkit** → Global state
- **React Query** → Server state
- **Axios** → HTTP client
- **TailwindCSS** → Styling
- **Socket.io-client** → Real-time communication
- **Lucide React** → Icons
- **Framer Motion** → Animations (future)

## ✅ Completed Enhancements

- ✅ App configuration (envConfig, roles)
- ✅ Theme & Query providers
- ✅ Role-based routing (FreelancerRoutes, ClientRoutes)
- ✅ API endpoints organization
- ✅ API modules (jobs, proposals, payments, users)
- ✅ UI components (Modal, Table)
- ✅ Services layer (AI, payments, chat, notifications)

## 📋 Future Enhancements

- [ ] Complete feature modules (pages, components, hooks)
- [ ] Add form components with validation
- [ ] Implement comprehensive error boundaries
- [ ] Add loading states & skeleton screens
- [ ] Create dashboard layouts
- [ ] Add internationalization (i18n)
- [ ] Implement advanced filtering & search
- [ ] Add data visualization (charts)
- [ ] Create reusable hooks library
- [ ] Add E2E testing

## 🎯 Best Practices

1. **Naming Conventions**
   - Components: PascalCase (JobCard.jsx)
   - Hooks: camelCase with 'use' prefix (useAuth.js)
   - Utils: camelCase (tokenManager.js)
   - Constants: UPPER_SNAKE_CASE

2. **File Organization**
   - One component per file
   - Export as default
   - Co-locate related files

3. **Code Quality**
   - Write meaningful comments
   - Follow DRY principle
   - Keep components small & focused
   - Use TypeScript for critical code (future)

4. **Performance**
   - Avoid unnecessary re-renders
   - Use React.memo for expensive components
   - Lazy load routes & components
   - Optimize images & assets

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels
   - Support keyboard navigation
   - Maintain color contrast ratios

---

**Built with ❤️ for Linkify - Smart Freelancing Platform**

*Last Updated: October 25, 2025*
