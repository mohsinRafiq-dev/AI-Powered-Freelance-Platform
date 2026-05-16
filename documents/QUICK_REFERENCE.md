# Quick Design Reference - Job Pages

## 🎨 Copy-Paste Templates

### Page Wrapper Template
```jsx
<div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-8">
  <div className="container mx-auto px-4 max-w-7xl">
    {/* Your content here */}
  </div>
</div>
```

### Page Header Template
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
    Brief description of the page
  </p>
</motion.div>
```

### Card Template
```jsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
  {/* Card content */}
</div>
```

### Button Templates
```jsx
{/* Primary Button */}
<Button className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg">
  Click Me
</Button>

{/* Outline Button */}
<Button variant="outline" className="border-2 border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10">
  Click Me
</Button>

{/* Ghost Button */}
<Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light hover:bg-gray-100 dark:hover:bg-gray-800">
  Click Me
</Button>
```

### Input Template
```jsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand dark:focus:border-brand-light transition-all"
  placeholder="Enter text..."
/>
```

### Badge Templates
```jsx
{/* Brand Badge */}
<Badge className="bg-brand text-white">
  Label
</Badge>

{/* Outline Badge */}
<Badge variant="outline" className="border-brand text-brand dark:border-brand-light dark:text-brand-light">
  Label
</Badge>

{/* Gradient Badge */}
<Badge className="bg-gradient-to-r from-brand to-brand-dark text-white">
  Featured
</Badge>
```

### Loading State Template
```jsx
<div className="flex flex-col items-center justify-center py-20">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader2 className="w-12 h-12 text-brand" />
  </motion.div>
  <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
    Loading...
  </p>
</div>
```

### Empty State Template
```jsx
<div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
  <div className="w-20 h-20 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
    <Icon className="w-10 h-10 text-white" />
  </div>
  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
    No Items Found
  </h3>
  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
    Description text here
  </p>
  <Button className="bg-gradient-to-r from-brand to-brand-dark text-white">
    Take Action
  </Button>
</div>
```

### Error State Template
```jsx
<div className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
    <AlertCircle className="w-8 h-8 text-red-500" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
    Something Went Wrong
  </h3>
  <p className="text-gray-600 dark:text-gray-400 mb-6">
    Error description here
  </p>
  <Button onClick={handleRetry} className="bg-brand hover:bg-brand-dark text-white">
    Try Again
  </Button>
</div>
```

### Grid Layout Templates
```jsx
{/* 2-column responsive grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {items.map(item => (
    <div key={item.id}>{/* Item */}</div>
  ))}
</div>

{/* 3-column responsive grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id}>{/* Item */}</div>
  ))}
</div>
```

### Animated List Template
```jsx
<div className="space-y-4">
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Item content */}
    </motion.div>
  ))}
</div>
```

---

## 🎨 Color Quick Reference

```jsx
// Backgrounds
bg-white dark:bg-gray-950          // Page background
bg-gray-50 dark:bg-gray-900        // Alternate sections
bg-white dark:bg-gray-800          // Cards
bg-gray-50 dark:bg-gray-700/50     // Nested cards

// Text
text-gray-900 dark:text-white      // Primary text
text-gray-700 dark:text-gray-300   // Secondary text  
text-gray-600 dark:text-gray-400   // Muted text
text-brand dark:text-brand-light   // Brand text

// Borders
border-gray-200 dark:border-gray-700                        // Default
hover:border-brand dark:hover:border-brand-light           // Hover
border-brand dark:border-brand-light                       // Active

// Interactive
hover:bg-gray-100 dark:hover:bg-gray-800                   // Hover background
hover:bg-brand/10 dark:hover:bg-brand-light/10             // Brand hover
```

---

## 📏 Spacing Quick Reference

```jsx
// Navbar clearance
pt-24 lg:pt-28

// Section spacing
py-8 lg:py-12

// Card padding
p-6 lg:p-8

// Element gaps
gap-4        // Between related items
gap-6        // Between sections
gap-8        // Between major sections

// Margins
mb-2         // Small margin
mb-4         // Medium margin  
mb-6         // Large margin
mb-8         // XL margin
```

---

## 🎭 Animation Quick Reference

```jsx
// Page entrance
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Card hover
whileHover={{ y: -4, scale: 1.02 }}
transition={{ duration: 0.3 }}

// Button tap
whileTap={{ scale: 0.95 }}

// Stagger children
transition={{ delay: index * 0.05 }}

// Spinner rotation
animate={{ rotate: 360 }}
transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
```

---

## 🔍 Common Patterns

### Search with Clear Button
```jsx
<div className="relative">
  <Search className="absolute left-4 top-3 w-5 h-5 text-brand" />
  <input 
    className="w-full pl-12 pr-12 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    placeholder="Search..."
  />
  {value && (
    <button className="absolute right-4 top-3">
      <X className="w-5 h-5 text-gray-400" />
    </button>
  )}
</div>
```

### Tab Navigation
```jsx
<div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
  {tabs.map(tab => (
    <button
      key={tab.id}
      className={`px-4 py-2 font-medium transition-colors ${
        activeTab === tab.id
          ? 'text-brand border-b-2 border-brand'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
      onClick={() => setActiveTab(tab.id)}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### Pagination
```jsx
<div className="flex items-center justify-center gap-2 mt-8">
  <Button
    variant="outline"
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  >
    Previous
  </Button>
  <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
    Page {currentPage} of {totalPages}
  </span>
  <Button
    variant="outline"
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
  >
    Next
  </Button>
</div>
```

---

## ✅ Pre-flight Checklist

Before committing new pages:

- [ ] Uses `bg-white dark:bg-gray-950` background
- [ ] Has `pt-24 lg:pt-28` navbar spacing
- [ ] All text has dark mode variants
- [ ] Buttons follow established patterns
- [ ] Cards have proper shadow and hover states
- [ ] Animations are smooth and purposeful
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading/error/empty states implemented
- [ ] Icons from lucide-react
- [ ] No inline styles

---

**Quick Start:** Copy templates above, replace content, customize as needed!
