# School Transparency - Design Framework

**Last Updated:** January 16, 2025  
**Purpose:** Visual and functional guidelines for building City Intelligence platform

---

## 🎨 Visual Identity

### Color System

**Primary Palette:**
- **White** (#FFFFFF) - Background, clean and trustworthy
- **Royal Blue** (#1e40af / blue-700) - Primary brand color, headers, main CTAs
- **Orange** (#f97316 / orange-500) - Accent color, warnings, secondary CTAs
- **Light Blue** (#dbeafe / blue-100) - Subtle backgrounds, highlights
- **Dark Blue** (#1e293b / slate-800) - Primary text color

**Semantic Colors:**
- **Green** (#10b981 / emerald-500) - Positive sentiment, good value
- **Red** (#ef4444 / red-500) - Warnings, high cost, negative
- **Yellow** (#f59e0b / amber-500) - Caution, moderate concern
- **Gray** (#64748b / slate-500) - Neutral, secondary text

### Color Usage Rules
```
✅ DO:
- White backgrounds for main content
- Royal blue for primary buttons and headers
- Orange for CTAs and important highlights
- Subtle blue tints for section backgrounds
- Color-code data (green=good, red=bad)

❌ DON'T:
- Use purple (old design)
- Mix too many colors in one section
- Use color without meaning
- Low contrast text
```

---

## 📐 Typography

### Font Hierarchy
```
H1: text-5xl md:text-6xl (48px-60px) - City names, page titles
H2: text-3xl md:text-4xl (30px-36px) - Section titles
H3: text-2xl (24px) - Subsection titles
Body: text-base md:text-lg (16px-18px) - Paragraph text
Small: text-sm (14px) - Labels, metadata
Tiny: text-xs (12px) - Captions, footnotes
```

### Font Weights
```
font-bold (700) - Headers, important data
font-semibold (600) - Subheaders, button text
font-medium (500) - Emphasis within body
font-normal (400) - Body text
```

### Line Heights
```
leading-tight - Headers (1.25)
leading-normal - Body text (1.5)
leading-relaxed - Long-form content (1.625)
```

---

## 📏 Spacing System

### Standard Spacing Scale
```
Section gaps: py-16 md:py-20 (64px-80px)
Component gaps: py-8 md:py-12 (32px-48px)
Card padding: p-6 md:p-8 (24px-32px)
Button padding: px-8 py-4 (32px 16px)
Small gaps: gap-3 md:gap-4 (12px-16px)
Large gaps: gap-6 md:gap-8 (24px-32px)
```

### Container Widths
```
max-w-7xl (1280px) - Main content container
max-w-4xl (896px) - Article/text content
max-w-2xl (672px) - Narrow content
```

---

## 🎭 Component Patterns

### Cards
```css
Base Card:
- rounded-2xl (16px border radius)
- overflow-hidden
- relative positioning for overlays
- h-[400px] (fixed height for grid consistency)

Hover State:
- hover:scale-[1.02]
- hover:shadow-2xl
- transition-all duration-300
- group for nested element animations
```

### Buttons

**Primary Button (Royal Blue):**
```css
bg-blue-700 text-white px-8 py-4 rounded-lg
font-semibold hover:bg-blue-800
transition-all duration-300
```

**Secondary Button (Orange):**
```css
bg-orange-500 text-white px-8 py-4 rounded-lg
font-semibold hover:bg-orange-600
transition-all duration-300
```

**Ghost Button:**
```css
border-2 border-blue-700 text-blue-700 px-8 py-4 rounded-lg
font-semibold hover:bg-blue-50
transition-all duration-300
```

### Badges
```css
Coming Soon Badge:
- absolute top-4 right-4
- bg-orange-500 text-white
- px-4 py-2 rounded-full
- text-sm font-semibold shadow-lg

Status Badges:
- inline-flex items-center
- px-3 py-1 rounded-full
- text-xs font-medium
- Color based on status (green/yellow/red)
```

### Input Fields
```css
Search/Input:
- w-full px-6 py-4
- bg-white border-2 border-blue-200
- rounded-xl
- text-slate-800 placeholder-slate-400
- focus:outline-none focus:ring-2 focus:ring-blue-600
- focus:border-transparent
```

---

## 🎬 Animations & Interactions

### Timing
```
Fast: 150ms - Small interactions (hover color change)
Standard: 300ms - Most transitions
Slow: 500ms - Page transitions, large movements
```

### Common Animations

**Card Hover:**
```css
transform: scale(1.02) translateY(-4px)
box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)
transition: all 300ms ease-in-out
```

**Button Hover:**
```css
transform: scale(1.05)
transition: all 200ms ease-in-out
```

**Fade In on Scroll:**
```css
opacity: 0 → 1
transform: translateY(20px) → translateY(0)
transition: all 500ms ease-out
```

### Micro-interactions
```
✅ Button hover: slight scale + color change
✅ Card hover: lift + shadow increase
✅ Input focus: border color + subtle ring
✅ Image hover: scale(1.1) on background
✅ Link hover: color change + underline
```

---

## 📱 Responsive Design

### Breakpoints
```
sm: 640px (mobile landscape)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
```

### Grid Layouts

**City Grid:**
```
Mobile: 1 column (grid-cols-1)
Tablet: 2 columns (md:grid-cols-2)
Desktop: 3 columns (lg:grid-cols-3)
Gap: gap-6 (24px)
```

**Data Sections:**
```
Mobile: Stack vertically
Tablet: 2 columns for stats
Desktop: 3-4 columns for dense data
```

### Mobile-Specific
```
✅ Touch targets: min 44px height
✅ Bottom navigation for main actions
✅ Swipeable cards where appropriate
✅ Collapsible sections (accordions)
✅ Readable without zooming (16px min)
```

---

## 🎯 Page Layouts

### City Grid Page
```
Structure:
1. Header (sticky)
   - Logo/title on left
   - "Back to home" on right
   - White background with border-b

2. Search Bar
   - Full width, centered container
   - Large input with icon
   - py-8 spacing

3. Filter Bar (future)
   - Sticky below header
   - Pill-style toggles
   - Horizontal scroll on mobile

4. City Grid
   - 3 columns on desktop
   - gap-6 between cards
   - pb-12 bottom padding

5. Empty State
   - Centered text
   - Helpful message
   - py-12 spacing
```

### Individual City Page
```
Structure:
1. Hero Section
   - Full-width image with gradient overlay
   - Centered city name (text-6xl)
   - Quick stats bar below
   - min-h-[60vh]

2. Sticky Navigation (future)
   - Economy | Salary | Schools | Sentiment
   - Sticky below header
   - Jump-to-section links

3. Content Sections
   - Full-width alternating backgrounds
   - Centered content container (max-w-7xl)
   - py-16 spacing between sections
   
4. Data Visualization
   - Mix of text, charts, cards
   - Color-coded metrics
   - Icons for quick scanning

5. Comparison Widget (future)
   - Fixed position bottom-right
   - "+ Compare" button
   - Opens side panel

6. Footer
   - Data sources
   - Last updated
   - Links
```

---

## 🎨 Design Inspiration Sources

### Visual Reference Sites

**Teleport (Urban)** - teleport.org
- ✅ Clean, spacious layouts
- ✅ Beautiful hero sections
- ✅ Excellent use of whitespace
- ✅ Smooth scroll animations
- ✅ Modern typography

**Nomad List** - nomadlist.com
- ✅ Card depth and shadows
- ✅ Data-dense but organized
- ✅ Good hover effects
- ✅ Intuitive filtering

**InterNations** - internations.org
- ✅ Professional polish
- ✅ Clean navigation
- ✅ Good use of photography

### What We're Avoiding

**Numbeo** - numbeo.com
- ❌ Cluttered tables
- ❌ Too many borders
- ❌ Small fonts
- ❌ No visual hierarchy
- ❌ Dated design

---

## 🔧 Technical Implementation

### Tailwind Classes Reference

**Commonly Used:**
```
Backgrounds: bg-white, bg-blue-50, bg-slate-100
Text: text-slate-800, text-blue-700, text-white
Borders: border-blue-200, border-slate-200
Shadows: shadow-lg, shadow-xl, shadow-2xl
Rounded: rounded-lg, rounded-xl, rounded-2xl, rounded-full
```

### Component File Structure
```
/src/components/
  ├── cities/
  │   ├── CityCard.js
  │   ├── CityHero.js
  │   ├── CityStats.js
  │   ├── DataSection.js
  │   └── ComparisonWidget.js
  ├── shared/
  │   ├── Button.js
  │   ├── Badge.js
  │   ├── SearchBar.js
  │   └── FilterPills.js
```

### Modular Approach
```
✅ Keep components small (< 200 lines)
✅ Separate visual from logic
✅ Reusable components in /shared
✅ Page-specific components in feature folders
✅ Easy to replace if something breaks
```

---

## 🎯 UX Principles

### Core Experience Goals

1. **Fast** - Page loads quickly, data appears instantly
2. **Scannable** - Users find key info in < 5 seconds
3. **Trustworthy** - Professional design, cited sources
4. **Actionable** - Clear CTAs, obvious next steps
5. **Delightful** - Smooth animations, pleasant interactions

### User Flow
```
Homepage → City Grid → Search/Filter → Select City → 
Individual City Page → Review Data → Compare Cities → 
Make Decision
```

### Key Interactions
```
✅ Hover: Show more info without clicking
✅ Click: Go deeper, see details
✅ Search: Find specific cities quickly
✅ Filter: Narrow down choices
✅ Compare: Side-by-side analysis
```

---

## 🚀 Implementation Phases

### Phase 1: Core Experience (Current)
- ✅ City grid with 6 mock cities
- ✅ Search functionality
- ✅ Basic card design
- ⏳ Individual city page (HCMC)

### Phase 2: Rich Data
- Add economic charts
- Salary breakdown sections
- School lists with ISR data
- Reddit sentiment widgets

### Phase 3: Interactive Features
- City comparison tool
- Filter system
- Savings calculator
- Favorite cities

### Phase 4: Advanced
- Interactive map
- User accounts
- Real-time data updates
- Notifications

---

## 📊 Data Visualization

### Chart Types

**Economic Data:**
- Line charts for GDP/Inflation trends
- Bar charts for comparative metrics
- Color-coded indicators (green/red)

**Salary Data:**
- Range bars showing min-max
- Comparison bars (city vs city)
- Breakdown by experience level

**Cost of Living:**
- Pie chart for expense categories
- Horizontal bars for item costs
- Comparison tables

### Icon System
```
💰 Salary/Income
🏠 Housing/Accommodation
🏫 Schools/Education
📈 Economic Growth
💬 Community Sentiment
✈️ Travel/Mobility
🏥 Healthcare
🛡️ Safety/Security
🍽️ Food/Dining
🚗 Transportation
```

---

## ✅ Quality Checklist

Before launching any page:

### Design
- [ ] Follows color system (blue/white/orange)
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent
- [ ] Mobile responsive (test on phone)
- [ ] Images have proper contrast overlays

### Functionality
- [ ] All links work
- [ ] Search returns results
- [ ] Hover states on interactive elements
- [ ] Loading states for data
- [ ] Empty states have helpful messages

### Performance
- [ ] Images are optimized
- [ ] No layout shift on load
- [ ] Smooth animations (no jank)
- [ ] Fast page load (< 3 seconds)

### Content
- [ ] Data sources cited
- [ ] Last updated date shown
- [ ] No placeholder text
- [ ] Grammar/spelling checked

---

## 🔗 Resources

### Tailwind Documentation
- https://tailwindcss.com/docs
- Focus on: layout, flexbox, grid, colors, shadows

### Design Inspiration
- https://dribbble.com/tags/data-visualization
- https://www.awwwards.com/websites/dashboard/

### Color Tools
- https://tailwindcss.com/docs/customizing-colors
- https://uicolors.app/create

---

## 📝 Notes for Developers

### Working with Claude
- Build components one at a time
- Use relative imports (not @/)
- Test on `npm run dev` before pushing
- Keep components under 200 lines
- Restart dev server when adding new files

### Git Workflow
- Commit after each working component
- Push to main → auto-deploys to Vercel
- Test on schooltransparency.com after deploy

### File Organization
- Pages in `/src/app/`
- Components in `/src/components/`
- Data in `/public/data/`
- Docs in `/docs/`

---

**End of Framework**

*This document should be updated as design evolves. Refer to this before building any new pages or components.*