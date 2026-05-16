# 📂 Client Directory Guide – Linkify

This document explains the **folder structure** of the `client/` application and the purpose of each directory.  
Use this guide to know **where to place files** and how to maintain a clean, scalable codebase.  

---

## Root Files
client/
│── .env # Environment variables (API URLs, keys)
│── vite.config.js # Vite configuration (or next.config.js if using Next.js)
│── tailwind.config.js # Tailwind CSS configuration
│── package.json # Dependencies & scripts
│── README.md # Project documentation

markdown
Copy code

---

## 📂 public/
Contains static assets served directly without processing.  

- `index.html` → Main entry HTML file.  
- `favicon.ico` → Site icon.  
- `assets/` → Place static images/icons that don’t change often (logos, placeholders).  

---

## 📂 src/
Main application source code.  

---

### 📂 api/
Holds **API handler functions** (Axios/Fetch) that call the backend.  

- `authApi.js` → Login, Register, CNIC verification APIs.  
- `jobApi.js` → Job posting & listing APIs.  
- `proposalApi.js` → Proposal-related APIs.  
- `paymentApi.js` → Wallet, Escrow, Transaction APIs.  
- `messagingApi.js` → Chat APIs.  
- `adminApi.js` → Admin panel APIs.  

👉 Add **only raw API calls here**, not business logic.

---

### 📂 app/
Holds **root-level app setup** like routes, providers, and configs.  

- `App.jsx` → Root App component.  
- `index.js` → React entry point.  

#### 📂 routes/
Centralized app routing.  
- `AppRoutes.jsx` → All routes defined here.  
- `PrivateRoute.jsx` → Protects routes (requires login).  
- `RoleBasedRoute.jsx` → Restricts access by role (freelancer, client, admin).  

#### 📂 providers/
Global context providers.  
- `AuthProvider.jsx` → Authentication state.  
- `ThemeProvider.jsx` → Light/Dark mode.  
- `LanguageProvider.jsx` → i18n language context.  
- `SocketProvider.jsx` → WebSocket connection context.  

#### 📂 config/
Global configurations.  
- `axiosConfig.js` → Axios defaults & interceptors.  
- `theme.js` → Tailwind theme customizations.  
- `constants.js` → Static values (roles, statuses).  

---

### 📂 components/
Reusable UI building blocks.  

- 📂 **common/** → Generic components (Buttons, Modals, Inputs, Loaders, Toasts).  
- 📂 **layout/** → Shared layout components (Navbar, Sidebar, Footer).  
- 📂 **forms/** → Reusable forms (LoginForm, RegisterForm, JobPostForm).  
- 📂 **cards/** → Card-style components (JobCard, ProposalCard, ProfileCard).  

👉 Use these across multiple features to avoid duplication.  

---

### 📂 features/
Feature-based modules (each contains **pages, components, hooks, store** if needed).  

- 📂 **auth/** → Authentication (Login, Register, CNIC verify).  
- 📂 **dashboard/** → Separate dashboards for freelancer, client, admin.  
- 📂 **jobs/** → Job posting, listing, details.  
- 📂 **proposals/** → Proposal submission, listing.  
- 📂 **payments/** → Wallet, escrow, transactions.  
- 📂 **messaging/** → Chat system with Socket.IO.  
- 📂 **skills/** → Skill tests, certifications.  
- 📂 **settings/** → Account settings, notifications.  

👉 Each **feature module is self-contained** → easier to maintain & scale.  

---

### 📂 hooks/
Reusable **custom hooks**.  

- `useAuth.js` → Authentication state.  
- `useTheme.js` → Dark/light mode.  
- `useSocket.js` → Real-time Socket.IO connection.  
- `usePagination.js` → Pagination logic for listings.  

---

### 📂 i18n/
Handles **internationalization** (English, Urdu).  

- `en.json` → English translations.  
- `ur.json` → Urdu translations.  
- `i18n.js` → i18next setup.  

---

### 📂 pages/
Standalone pages not tied to a feature.  

- `Home.jsx` → Landing page.  
- `About.jsx` → About Linkify.  
- `Contact.jsx` → Contact form page.  
- `FAQ.jsx` → Frequently asked questions.  
- `NotFound.jsx` → 404 page.  

---

### 📂 services/
Business logic layer → connects **UI (components)** with **API calls (api/)**.  

- `authService.js` → Handles auth workflows.  
- `jobService.js` → Job-related workflows.  
- `proposalService.js` → Proposal workflows.  
- `paymentService.js` → Wallet & escrow workflows.  
- `chatService.js` → Messaging workflows.  

👉 Keeps business logic separate from raw API calls.  

---

### 📂 store/
Centralized **state management** (Redux Toolkit).  

- 📂 `slices/` → Each feature’s slice (authSlice, jobSlice, chatSlice).  
- `store.js` → Root Redux store.  

---

### 📂 styles/
Global styling & Tailwind configs.  

- `globals.css` → App-wide CSS.  
- `tailwind.css` → Tailwind imports.  
- `variables.css` → Global color/font variables.  

---

### 📂 utils/
Helper functions.  

- `validators.js` → Input validators.  
- `formatDate.js` → Date formatting.  
- `errorHandler.js` → Centralized error handling.  
- `authGuard.js` → Auth/role checks.  

---

# ✅ Summary
- **api/** → Backend API calls.  
- **app/** → Root app setup (routes, providers, config).  
- **components/** → Reusable UI pieces.  
- **features/** → Feature-based modules.  
- **hooks/** → Custom React hooks.  
- **i18n/** → Multi-language setup.  
- **pages/** → Public pages.  
- **services/** → Business logic layer.  
- **store/** → Global state management.  
- **styles/** → Styling configs.  
- **utils/** → Helpers & utilities.  

---