# Job Pages Design System

## 🎨 Design Consistency Rules

All job-related pages follow these strict design guidelines to maintain consistency with the Home page.

---

## 📐 Layout Standards

### Page Container
```jsx
<div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-8">
  <div className="container mx-auto px-4 max-w-7xl">
    {/* Content */}
  </div>
</div>
```

**Key Points:**
- Always use `bg-white dark:bg-gray-950` for main background
- Consistent navbar spacing: `pt-24 lg:pt-28`
- Bottom padding: `pb-8` for breathing room
- Max width: `max-w-7xl` for most pages, `max-w-5xl` for detail pages

---

## 🎨 Color Palette

### Backgrounds
- **Main Page:** `bg-white dark:bg-gray-950`
- **Alternate Sections:** `bg-gray-50 dark:bg-gray-900`
- **Cards:** `bg-white dark:bg-gray-800`
- **Hover Cards:** `bg-gray-50 dark:bg-gray-700/50`

### Text Colors
- **Primary:** `text-gray-900 dark:text-white`
- **Secondary:** `text-gray-700 dark:text-gray-300`
- **Muted:** `text-gray-600 dark:text-gray-400`
- **Brand:** `text-brand dark:text-brand-light`

### Borders
- **Default:** `border-gray-200 dark:border-gray-700`
- **Hover:** `hover:border-brand dark:hover:border-brand-light`
- **Active:** `border-brand dark:border-brand-light`

### Buttons
```jsx
// Primary Button
className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white"

// Outline Button
className="border-2 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"

// Ghost Button
className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800"
```

---

## 📦 Component Patterns

### Card Component
```jsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
  {/* Content */}
</div>
```

### Section Header
```jsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8"
>
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
    Page Title
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    Page description
  </p>
</motion.div>
```

### Form Inputs
```jsx
<input
  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
/>
```

### Badges
```jsx
// Brand Badge
<Badge className="bg-brand text-white">Label</Badge>

// Outline Badge
<Badge variant="outline" className="border-brand text-brand dark:border-brand-light dark:text-brand-light">
  Label
</Badge>
```

---

## 🎭 Animation Standards

### Page Entrance
```jsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Card Hover
```jsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
```

### Staggered Children
```jsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
))}
```

---

## 📱 Responsive Design

### Grid Layouts
```jsx
// 2 columns on large screens
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// 3 columns with responsive breakpoints
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Flex Layouts
```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
```

---

## 🔍 Shadows & Effects

### Shadow Levels
- **Card:** `shadow-lg`
- **Hover:** `hover:shadow-xl`
- **Elevated:** `shadow-2xl`

### Rounded Corners
- **Cards:** `rounded-xl`
- **Buttons:** `rounded-lg`
- **Badges:** `rounded-full` or `rounded-lg`

---

## ✅ Checklist for New Pages

- [ ] Use `bg-white dark:bg-gray-950` for page background
- [ ] Add `pt-24 lg:pt-28` for navbar clearance
- [ ] Use consistent text colors (gray-900/white, gray-600/gray-400)
- [ ] Cards use `bg-white dark:bg-gray-800`
- [ ] Borders are `border-gray-200 dark:border-gray-700`
- [ ] Hover states include `hover:border-brand dark:hover:border-brand-light`
- [ ] Buttons follow the established patterns
- [ ] Animations use framer-motion with consistent transitions
- [ ] Responsive classes for mobile, tablet, desktop
- [ ] All interactive elements have hover states
- [ ] Loading states are centered and styled consistently
- [ ] Empty states follow EmptyState component pattern

---

## 🎯 Pages Compliance Status

✅ **JobList** - Fully compliant
✅ **JobDetails** - Fully compliant
✅ **CreateJob** - Fully compliant
✅ **MyJobs** - Fully compliant
✅ **RecommendedJobs** - Fully compliant

---

## 📚 Component Library

### Available Components
- `JobCard` - Consistent job card with all states
- `JobFilters` - Sidebar filter with all options
- `JobSearchBar` - Search input with icon
- `SkillSelector` - Multi-select skill picker
- `BudgetInput` - Budget type selector with progress bars
- `Button` - UI button with variants
- `Badge` - UI badge with variants
- `EmptyState` - Consistent empty state component

---

## 🚀 Best Practices

1. **Always use Tailwind classes** - No inline styles
2. **Dark mode for everything** - Every color must have dark variant
3. **Animations for user feedback** - Use framer-motion for smooth transitions
4. **Consistent spacing** - Use Tailwind spacing scale (4, 6, 8, 12, etc.)
5. **Semantic HTML** - Use proper heading hierarchy
6. **Accessibility** - Include ARIA labels where needed
7. **Performance** - Lazy load images, optimize animations
8. **Mobile-first** - Design for mobile, enhance for desktop

---

## 🎨 Brand Colors Reference

```css
/* Light Mode */
--brand: #84A98C
--brand-light: #A8DADC
--brand-dark: #52796F
--brand-deeper: #354F52
--brand-deepest: #2F3E46

/* Dark Mode */
Use same colors with adjusted opacity/brightness
```

---

**Last Updated:** November 12, 2025
**Maintained By:** Linkify Development Team
