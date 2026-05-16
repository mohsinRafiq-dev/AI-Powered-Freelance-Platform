# 🏗️ Client Architecture - State Management Guide

## 📊 State Management Strategy

We use a **hybrid approach** with TWO state management solutions:

### 1. **Redux Toolkit** (Global App State)
**Location:** `src/store/`

**Used For:**
- ✅ **Authentication** (`authSlice.js`) - User session, token, login state
- ⚠️ **Proposals** (`proposalSlice.js`) - Legacy implementation

**Why Redux for Auth?**
- Auth is truly global state (needed everywhere)
- Token management integrated
- Persists across page reloads

### 2. **React Query** (Server Data)
**Location:** Feature hooks (e.g., `features/jobs/hooks/`)

**Used For:**
- ✅ **Jobs** - Fetching, creating, updating, deleting jobs
- ✅ **Profile** - User profiles, updates
- ✅ **Users** - User listings

**Why React Query?**
- Automatic caching & synchronization
- Built-in loading & error states  
- Automatic refetching & invalidation
- Better for server data

---

## 🗂️ File Organization

```
src/
├── store/                    # Redux store
│   ├── store.js             # Store configuration
│   └── slices/
│       ├── authSlice.js     # ✅ Auth state (correct)
│       └── proposalSlice.js # ⚠️ TODO: Migrate to React Query
│
├── features/
│   ├── jobs/
│   │   └── hooks/           # ✅ React Query hooks
│   │       ├── useJobs.js
│   │       ├── useCreateJob.js
│   │       └── useJobDetails.js
│   │
│   ├── proposals/
│   │   └── hooks/           # ⚠️ Redux hooks (legacy)
│   │       ├── useMyProposals.js
│   │       ├── useSubmitProposal.js
│   │       └── useWithdrawProposal.js
│   │
│   └── profile/
│       └── hooks/           # ✅ React Query hooks
│           ├── useProfile.js
│           └── useUpdateProfile.js
```

---

## ✅ Best Practices

### **When to Use Redux:**
- Global UI state (theme, modals, sidebar open/close)
- Auth state (user, token, isAuthenticated)
- State that needs to persist across routes

### **When to Use React Query:**
- Any server data (GET/POST/PUT/DELETE)
- Lists, details, forms that fetch from API
- Data that needs caching & auto-refresh

### **When to Use Local State:**
- Component-specific UI state (form inputs, dropdowns)
- Temporary state that doesn't need sharing
- Modal open/close, tabs, accordions

---

## 🔄 API Pattern

All API calls go through centralized API files:

```javascript
// ✅ Good Pattern
import { getAllJobs } from '@/api/jobsApi';

const { data } = useQuery({
  queryKey: ['jobs'],
  queryFn: getAllJobs,
});
```

```javascript
// ❌ Avoid
import axios from 'axios';

const response = await axios.get('/api/jobs'); // Don't do this
```

---

## 📁 Import Aliases

Use the `@/` alias for all absolute imports:

```javascript
// ✅ Good
import { Button } from '@/components/ui/button';
import { useJobs } from '@/features/jobs/hooks';
import { formatDate } from '@/utils/formatters';

// ❌ Avoid
import { Button } from '../../../components/ui/button';
import { useJobs } from '../../jobs/hooks';
```

---

## 🔧 Future Improvements

### Priority 1: Migrate Proposals to React Query
```javascript
// Current (Redux):
const { proposals } = useSelector(state => state.proposals);

// Target (React Query):
const { data: proposals } = useMyProposals();
```

### Priority 2: Remove Unused Services
- Check if `paymentService.js` is just an API wrapper
- Keep only WebSocket services (chat, notifications)

### Priority 3: Clean Console Logs
- Remove all debugging `console.log` statements
- Keep only `console.error` for error boundaries

---

## 📚 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `store/slices/authSlice.js` | Auth state + token management | ✅ Correct |
| `store/slices/proposalSlice.js` | Proposal state | ⚠️ Should migrate to React Query |
| `app/providers/QueryProvider.jsx` | React Query setup | ✅ Correct |
| `vite.config.js` | Alias configuration (`@/`) | ✅ Correct |

---

## 🚦 Quick Decision Tree

**Need to store data?**
├─ Is it from the server? → Use React Query
├─ Is it global app state? → Use Redux  
└─ Is it component-specific? → Use useState/useReducer

---

## 💡 Common Patterns

### Fetching Data (React Query)
```javascript
const { data, isLoading, error } = useJobs(filters);
```

### Mutating Data (React Query)
```javascript
const { mutate: createJob } = useCreateJob();
createJob(jobData);
```

### Global State (Redux)
```javascript
const { user, isAuthenticated } = useSelector(state => state.auth);
const dispatch = useDispatch();
dispatch(loginUser(credentials));
```

---

**Last Updated:** November 16, 2025  
**Maintainer:** Development Team
