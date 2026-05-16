
(Always follow this guide for generating, updating, or reviewing Linkify code)

🚀 Project Identity

Project Name: Linkify – Smart Freelancing Platform for Pakistan


🏗️ 1. Architecture Design Principles

1. server
/src
├── modules/
│   ├── auth/
│   ├── jobs/
│   ├── payments/
│   ├── proposals/
│   ├── messaging/
│   ├── admin/
│   └── shared/
│
├── config/
├── core/
│   ├── errors/
│   ├── utils/
│   └── middlewares/
│
├── sockets/
├── queue/
└── tests/

2. cliennt  Structure Overview
linkify-client/
│
├── public/                     # Static assets (favicons, logo, manifest)
│
└── src/
    ├── app/                    # Core app setup (entry, providers, routes)
    │   ├── main.jsx            # Application entry (ReactDOM.createRoot)
    │   ├── App.jsx             # Root layout + router
    │   ├── config/             # App-wide constants & env vars
    │   │   ├── envConfig.js
    │   │   └── roles.js
    │   ├── providers/          # Context providers (Auth, Theme, Query)
    │   │   ├── AuthProvider.jsx
    │   │   ├── ThemeProvider.jsx
    │   │   └── QueryProvider.jsx
    │   └── routes/             # Route definitions
    │       ├── AppRoutes.jsx
    │       ├── PrivateRoutes.jsx
    │       ├── FreelancerRoutes.jsx
    │       └── ClientRoutes.jsx
    │
    ├── api/                    # All backend communication
    │   ├── axiosInstance.js    # Base Axios setup + interceptors
    │   ├── endpoints/          # REST endpoint constants
    │   │   ├── auth.js
    │   │   ├── jobs.js
    │   │   ├── proposals.js
    │   │   ├── payments.js
    │   │   └── users.js
    │   ├── authApi.js
    │   ├── jobsApi.js
    │   ├── proposalsApi.js
    │   ├── paymentsApi.js
    │   └── usersApi.js
    │
    ├── components/             # Global reusable UI components
    │   ├── ui/                 # Atomic, design-system-level components
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Table.jsx
    │   │   └── Badge.jsx
    │   ├── layout/             # Page structure components
    │   │   ├── Navbar.jsx
    │   │   ├── SidebarFreelancer.jsx
    │   │   ├── SidebarClient.jsx
    │   │   ├── Footer.jsx
    │   │   └── DashboardLayout.jsx
    │   ├── forms/              # Reusable form components
    │   │   ├── LoginForm.jsx
    │   │   ├── RegisterForm.jsx
    │   │   └── JobPostForm.jsx
    │   └── common/             # Alerts, spinners, etc.
    │       ├── Loader.jsx
    │       ├── EmptyState.jsx
    │       └── Pagination.jsx
    │
    ├── features/               # Domain-specific features
    │   ├── auth/
    │   │   ├── pages/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── CompleteProfile.jsx
    │   │   │   └── GoogleCallback.jsx
    │   │   ├── hooks/useAuth.js
    │   │   └── validation/authValidation.js
    │   │
    │   ├── freelancer/
    │   │   ├── pages/
    │   │   │   ├── DashboardFreelancer.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   ├── MyJobs.jsx
    │   │   │   └── Wallet.jsx
    │   │   ├── components/
    │   │   │   ├── ProfileCard.jsx
    │   │   │   ├── JobCard.jsx
    │   │   │   └── EarningsChart.jsx
    │   │   └── hooks/useFreelancerData.js
    │   │
    │   ├── client/
    │   │   ├── pages/
    │   │   │   ├── DashboardClient.jsx
    │   │   │   ├── PostJob.jsx
    │   │   │   ├── ManageJobs.jsx
    │   │   │   └── Payments.jsx
    │   │   ├── components/
    │   │   │   ├── JobPostForm.jsx
    │   │   │   └── ProposalCard.jsx
    │   │   └── hooks/useClientData.js
    │   │
    │   ├── jobs/
    │   │   ├── pages/
    │   │   │   ├── JobListing.jsx
    │   │   │   └── JobDetail.jsx
    │   │   └── components/
    │   │       ├── FilterSidebar.jsx
    │   │       └── JobCard.jsx
    │   │
    │   ├── proposals/
    │   │   ├── pages/
    │   │   │   ├── ProposalList.jsx
    │   │   │   └── ProposalDetail.jsx
    │   │   └── components/
    │   │       ├── ProposalForm.jsx
    │   │       └── ProposalCard.jsx
    │   │
    │   ├── messaging/
    │   │   ├── pages/
    │   │   │   └── ChatRoom.jsx
    │   │   └── components/
    │   │       ├── ChatSidebar.jsx
    │   │       └── MessageBubble.jsx
    │   │
    │   └── payments/
    │       ├── pages/
    │       │   ├── EscrowPayments.jsx
    │       │   └── Transactions.jsx
    │       └── components/
    │           └── PaymentCard.jsx
    │
    ├── hooks/                  # Global reusable custom hooks
    │   ├── useAuth.js
    │   ├── useFetch.js
    │   └── useNotifications.js
    │
    ├── services/               # External service integrations
    │   ├── aiService.js        # OpenAI integration for job matching/proposals
    │   ├── paymentService.js   # JazzCash / Easypaisa API interaction
    │   ├── chatService.js      # Socket.io wrapper
    │   └── notificationService.js
    │
    ├── store/                  # State management
    │   ├── store.js
    │   └── slices/
    │       ├── authSlice.js
    │       ├── jobSlice.js
    │       ├── proposalSlice.js
    │       └── paymentSlice.js
    │
    ├── styles/                 # Global & theme styles
    │   ├── globals.css
    │   ├── theme.css
    │   └── variables.css
    │
    ├── utils/                  # Helper functions
    │   ├── tokenManager.js
    │   ├── validation.js
    │   ├── formatDate.js
    │   └── constants.js
    │
    ├── assets/                 # Icons, logos, images
    │   ├── images/
    │   ├── icons/
    │   └── logos/
    │
    └── i18n/                   # Language support (optional)
        ├── en/
        └── ur/

🧩 3. Core Architectural Rules

Feature Isolation:
Every new feature must exist in its own folder under /features/.
A feature must never directly import code from another feature — shared logic goes into /components, /services, or /hooks.

UI Consistency:
All visual elements (buttons, inputs, cards, modals) must come from /components/ui.

API Calls:

Always use functions from /api/*Api.js files.

Never hardcode URLs. Use constants from /api/endpoints/.

State Management:

Use Redux Toolkit for persistent or global states (auth, jobs, payments).

Use React Query for API-driven data (listings, proposals).

Routing:

Use nested routes for role-based dashboards (FreelancerRoutes, ClientRoutes).

Always protect routes using PrivateRoutes.jsx.

Styling:

Use Tailwind CSS utility classes for layout & spacing.

Use theme.css and variables.css for consistent color and font scaling.

Authentication Flow:

Store JWT in secure HttpOnly cookies or localStorage via tokenManager.js.

Access current user data through AuthProvider.

Dark/Light Mode:

Maintain both via ThemeProvider.jsx.

Colors must follow Linkify brand palette.

Socket Connections:

Handle sockets in chatService.js and notificationService.js.

Do not open multiple socket instances — use a singleton connection.

Error & Loading States:

Always use standard Loader/EmptyState components.

Display toast notifications for user feedback.
✅ Guidelines:

Each module must have controller, service, route, validation, and model.

Use repository pattern for database abstraction.

Keep all logic in services — controllers only handle I/O.

Use async/await with proper error handling (no .then chains).

Write reusable middlewares for auth, validation, and error handling.

Use DTOs (Data Transfer Objects) or consistent response patterns.

🎨 2. UI/UX Design

(Follow these modern web design principles for every screen and component.)

🌍 Modern Web Design Principles for Exceptional UI/UX
🧩 1. Simplicity & Clarity

“Less, but better.” Keep layouts clean and minimal.

Every element must serve a clear purpose.

🎨 2. Visual Hierarchy

Use color, contrast, and spacing to guide the user’s attention.

One clear primary action (CTA) per page.

⚡ 3. Consistency & Predictability

Maintain identical UI patterns across pages.

Buttons, modals, and form fields must share uniform styles.

🪶 4. Whitespace & Breathing Room

Use whitespace liberally to reduce visual noise.

🧭 5. Intuitive Navigation

Users should never be confused about where they are.

Highlight active links, use breadcrumbs, and accessible menus.

🎞️ 6. Micro-Interactions & Motion

Use Framer Motion or Lottie for subtle, meaningful animations.

🌗 7. Dark / Light Mode

Support both modes with consistent contrast and readability.

🎯 8. Accessibility (A11y)

Follow WCAG standards: alt text, keyboard navigation, and readable contrasts.

🪄 9. Personalization & Context Awareness

Adapt dashboard and content dynamically to user type (Freelancer / Client).

⚙️ 10. Performance & Responsiveness

Optimize for <2s load time and perfect mobile scaling.

💬 11. Feedback & State Awareness

Always provide feedback: loading states, toasts, error indicators.

🧬 12. Data Visualization

Use Recharts or Chart.js with minimal, elegant styling.

🧱 13. Design System Reusability

Centralize UI components under /components/ui for full reusability.

🧭 14. Mobile-First & Adaptive Design

Design mobile-first, then scale upward with responsive grids.

🧠 15. Emotional Design

Build trust through soft transitions, human copy, and brand colors.

🌈 3. Linkify Official Color Scheme
Role	Color	Hex	Usage
Primary (Main Brand)	🌿 Soft Green	#84A98C	Buttons, highlights, brand accents
Primary Light	🌱 Misty Green	#CAD2C5	Backgrounds, cards
Primary Dark	🌲 Deep Forest	#52796F	Hover, links
Secondary	🖤 Slate Gray	#354F52	Navigation, typography
Accent / Neutral Dark	🌑 Charcoal	#2F3E46	Sidebar, footer, text
🧠 Color Psychology & Application
Color	Meaning	Usage
#CAD2C5	Calm, clean	Backgrounds, form areas
#84A98C	Growth, trust	Buttons, primary actions
#52796F	Balance	Secondary buttons, hovers
#354F52	Strength	Headings, navbar
#2F3E46	Focus	Text, footer
🧩 UI Application Mapping
UI Element	Color
Navbar	#2F3E46 background, white text
Sidebar	#354F52 background, #CAD2C5 text
Buttons	Primary #84A98C → Hover #52796F
Cards	#CAD2C5 or white background, soft shadow
Text	Primary #2F3E46, secondary #52796F
Footer	#2F3E46 background + #84A98C accents
💾 TailwindCSS Theme Config
theme: {
  extend: {
    colors: {
      brand: {
        light: "#CAD2C5",
        DEFAULT: "#84A98C",
        dark: "#52796F",
        deeper: "#354F52",
        deepest: "#2F3E46",
      },
    },
  },
},


Usage:

<button className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md">
  Get Started
</button>

🌤️ Gradient (for Hero or CTA Sections)
background: linear-gradient(135deg, #84A98C 0%, #52796F 100%);

🌗 Dark Mode Variant
Role	Hex
Background	#2F3E46
Surface	#354F52
Accent	#84A98C
Text	#CAD2C5
⚙️ 4. Developer Conduct

Always follow Linkify’s architectural pattern and color system.

Every new feature = new folder under /features/ (React) or /modules/ (Node).

Code should be clean, DRY (Don’t Repeat Yourself), and self-documented.

Commit messages must be descriptive (e.g., feat(auth): added Google OAuth route).

Maintain consistent naming conventions (camelCase for JS, PascalCase for components).

Any new UI component must follow UI/UX principles above and brand colors.

🧾 5. Reference Summary

Architecture: Feature-based modular MERN structure

UI Library: TailwindCSS + Shadcn/UI

Animation: Framer Motion + Lottie

Data Layer: Redux Toolkit / React Query

Design System: Consistent, minimal, accessible

Color Palette: Green-gray modern blend (nature-inspired)

UX Core Values: Clarity • Trust • Functionality • Simplicity

🧭 Final Instruction to Developer / AI Assistant

Always use this document as the Linkify Standard Guideline when generating, editing, or refactoring any code, UI component, API module, or feature.
Follow the defined architecture, UI/UX principles, and official color scheme strictly to maintain brand consistency and legacy quality across the entire Linkify platform.