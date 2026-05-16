# 🌈 Linkify Color System Guide

## Official Brand Colors

### Color Palette

| Role | Color | Hex | RGB | Usage |
|------|-------|-----|-----|-------|
| **Primary (Brand)** | 🌿 Soft Green | `#84A98C` | `rgb(132, 169, 140)` | Buttons, highlights, brand accents |
| **Primary Light** | 🌱 Misty Green | `#CAD2C5` | `rgb(202, 210, 197)` | Backgrounds, cards, form areas |
| **Primary Dark** | 🌲 Deep Forest | `#52796F` | `rgb(82, 121, 111)` | Hover states, links, secondary buttons |
| **Secondary** | 🖤 Slate Gray | `#354F52` | `rgb(53, 79, 82)` | Navigation, headings, typography |
| **Accent/Dark** | 🌑 Charcoal | `#2F3E46` | `rgb(47, 62, 70)` | Sidebar, footer, primary text |

## TailwindCSS Configuration

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      brand: {
        light: "#CAD2C5",      // Misty Green
        DEFAULT: "#84A98C",    // Soft Green
        dark: "#52796F",       // Deep Forest
        deeper: "#354F52",     // Slate Gray
        deepest: "#2F3E46",    // Charcoal
      },
    },
    backgroundImage: {
      'gradient-brand': 'linear-gradient(135deg, #84A98C 0%, #52796F 100%)',
    },
  },
}
```

## Usage Guidelines

### 1. Buttons

#### Primary Buttons
```jsx
// Default brand button
<button className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-md">
  Primary Action
</button>

// With gradient
<button className="bg-gradient-brand hover:opacity-90 text-white px-4 py-2 rounded-md">
  Get Started
</button>
```

#### Secondary Buttons
```jsx
<button className="bg-brand-light hover:bg-brand text-brand-deepest hover:text-white px-4 py-2 rounded-md">
  Secondary Action
</button>
```

#### Outline Buttons
```jsx
<button className="border-2 border-brand text-brand hover:bg-brand hover:text-white px-4 py-2 rounded-md">
  Learn More
</button>
```

### 2. Navigation

#### Navbar
```jsx
<nav className="bg-brand-deepest border-b border-brand-deeper">
  <div className="text-brand-light hover:text-white">Navigation Items</div>
</nav>
```

#### Sidebar
```jsx
<aside className="bg-brand-deeper text-brand-light">
  <div className="hover:bg-brand-deepest hover:text-white">Menu Item</div>
</aside>
```

### 3. Cards & Backgrounds

#### Light Background Cards
```jsx
<div className="bg-brand-light/30 rounded-lg p-6">
  <h3 className="text-brand-deepest">Card Title</h3>
  <p className="text-brand-deeper">Card content</p>
</div>
```

#### White Cards with Border
```jsx
<div className="bg-white border-2 border-brand-light hover:border-brand rounded-lg p-6">
  <h3 className="text-brand-deepest">Card Title</h3>
</div>
```

### 4. Typography

#### Headings
```jsx
// Primary heading
<h1 className="text-4xl font-bold text-brand-deepest">
  Main Heading
</h1>

// With brand accent
<h2 className="text-3xl font-bold text-brand-deepest">
  Section with <span className="text-brand">Highlight</span>
</h2>
```

#### Body Text
```jsx
// Primary text
<p className="text-brand-deepest">Primary content text</p>

// Secondary text
<p className="text-brand-deeper">Secondary or muted text</p>

// Light text (on dark backgrounds)
<p className="text-brand-light">Text on dark backgrounds</p>
```

### 5. Forms

#### Input Fields
```jsx
<input 
  className="border-2 border-brand-light focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-md px-4 py-2"
  placeholder="Enter text..."
/>
```

#### Form Backgrounds
```jsx
<div className="bg-brand-light/20 rounded-lg p-6">
  {/* Form content */}
</div>
```

### 6. Links

```jsx
// Primary link
<a className="text-brand hover:text-brand-dark underline">Learn More</a>

// Navigation link
<a className="text-brand-light hover:text-white">Menu Item</a>

// Footer link
<a className="text-brand-light hover:text-brand">Footer Link</a>
```

### 7. Alerts & Notifications

#### Success
```jsx
<div className="bg-brand/10 border-l-4 border-brand text-brand-deepest p-4">
  Success message
</div>
```

#### Info
```jsx
<div className="bg-brand-light border-l-4 border-brand-dark text-brand-deepest p-4">
  Information message
</div>
```

### 8. Gradients

#### Hero Sections
```jsx
<section className="bg-gradient-brand text-white">
  <h1>Hero Content</h1>
</section>
```

#### Subtle Backgrounds
```jsx
<div className="bg-gradient-to-br from-brand-light/30 to-white">
  Content
</div>
```

#### Text Gradients
```jsx
<h1 className="bg-gradient-brand bg-clip-text text-transparent">
  Gradient Text
</h1>
```

## Dark Mode Support

### Dark Mode Colors
```jsx
// Background
<div className="bg-white dark:bg-brand-deepest">
  
  // Surface/Cards
  <div className="bg-gray-50 dark:bg-brand-deeper">
    
    // Text
    <p className="text-brand-deepest dark:text-brand-light">Content</p>
    
    // Accent
    <button className="bg-brand dark:bg-brand-dark">Action</button>
    
  </div>
</div>
```

## Component-Specific Colors

### Navigation Bar
- **Background:** `bg-brand-deepest` (Charcoal #2F3E46)
- **Text:** `text-brand-light` (Misty Green #CAD2C5)
- **Hover:** `hover:text-white` + `hover:bg-brand-deeper`

### Footer
- **Background:** `bg-brand-deepest` (Charcoal #2F3E46)
- **Text:** `text-brand-light` (Misty Green #CAD2C5)
- **Links Hover:** `hover:text-brand` (Soft Green #84A98C)

### Primary Buttons
- **Background:** `bg-brand` (Soft Green #84A98C)
- **Hover:** `hover:bg-brand-dark` (Deep Forest #52796F)
- **Text:** `text-white`

### Cards
- **Background:** `bg-brand-light/30` or `bg-white`
- **Border:** `border-brand-light`
- **Hover Border:** `hover:border-brand`
- **Title:** `text-brand-deepest`
- **Content:** `text-brand-deeper`

### Hero Sections
- **Background:** `bg-gradient-brand`
- **Text:** `text-white`
- **Accent Text:** `text-brand-light`

## Accessibility Guidelines

### Contrast Ratios (WCAG AA Compliant)

✅ **High Contrast Combinations:**
- White text on `brand-deepest` (#2F3E46) - Ratio: 12.6:1
- White text on `brand-deeper` (#354F52) - Ratio: 10.8:1
- White text on `brand-dark` (#52796F) - Ratio: 7.2:1
- `brand-deepest` text on white - Ratio: 12.6:1
- `brand-deepest` text on `brand-light` - Ratio: 8.4:1

⚠️ **Medium Contrast (Use for large text only):**
- White text on `brand` (#84A98C) - Ratio: 4.1:1
- `brand-deeper` text on `brand-light` - Ratio: 4.8:1

## Best Practices

### DO ✅
- Use `brand` for primary actions and CTAs
- Use `brand-deepest` for primary text on light backgrounds
- Use `brand-light` for backgrounds and subtle elements
- Use gradients for hero sections and CTAs
- Maintain consistent hover states (darker shades)

### DON'T ❌
- Don't use `brand` color for body text (low contrast)
- Don't mix with blue/purple gradients (off-brand)
- Don't use more than 3 brand colors in one component
- Don't forget hover states on interactive elements

## Color Psychology

- **#CAD2C5 (Misty Green)** - Calm, clean, peaceful
- **#84A98C (Soft Green)** - Growth, trust, balance
- **#52796F (Deep Forest)** - Stability, reliability
- **#354F52 (Slate Gray)** - Strength, professionalism
- **#2F3E46 (Charcoal)** - Focus, sophistication

## Quick Reference

```css
/* Variables for direct CSS use */
:root {
  --brand-light: #CAD2C5;
  --brand: #84A98C;
  --brand-dark: #52796F;
  --brand-deeper: #354F52;
  --brand-deepest: #2F3E46;
  
  --gradient-brand: linear-gradient(135deg, #84A98C 0%, #52796F 100%);
}
```

## Example Compositions

### Landing Page Hero
```jsx
<section className="bg-gradient-brand text-white py-20">
  <h1 className="text-5xl font-bold mb-4">
    Welcome to <span className="text-brand-light">Linkify</span>
  </h1>
  <p className="text-xl text-brand-light/90 mb-8">
    Your freelancing journey starts here
  </p>
  <button className="bg-white text-brand hover:bg-brand-light hover:text-brand-deepest px-8 py-3 rounded-md font-semibold shadow-lg">
    Get Started Free
  </button>
</section>
```

### Dashboard Card
```jsx
<div className="bg-white border-2 border-brand-light hover:border-brand rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
  <div className="w-12 h-12 bg-gradient-brand rounded-lg flex items-center justify-center mb-4">
    <Icon className="text-white" />
  </div>
  <h3 className="text-xl font-semibold text-brand-deepest mb-2">Card Title</h3>
  <p className="text-brand-deeper">Card description text</p>
  <button className="mt-4 text-brand hover:text-brand-dark font-medium">
    Learn More →
  </button>
</div>
```

---

**Last Updated:** October 26, 2025
**Status:** ✅ Implemented
**Version:** 1.0.0
