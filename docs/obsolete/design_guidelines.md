# Design Guidelines: Outbound Sales CRM Platform

## Design Approach
**Selected Approach**: Design System - Salesforce Lightning Design System + Modern SaaS Productivity Patterns

**Justification**: This is a utility-focused, information-dense CRM tool where efficiency and usability are paramount. Drawing from Salesforce Lightning Design System ensures familiar enterprise patterns, while incorporating modern productivity aesthetics from Linear and Notion for enhanced user experience.

**Key Design Principles**:
- Data clarity over decoration
- Instant recognition of status and priority
- Efficient workflows with minimal clicks
- Scalable information architecture
- Professional enterprise credibility

## Core Design Elements

### A. Color Palette

**Primary Colors**:
- Brand Primary: 215 95% 50% (Modern blue, trustworthy)
- Primary Hover: 215 95% 45%

**Semantic Colors**:
- Success (Interested): 142 71% 45%
- Warning (Follow-up needed): 38 92% 50%
- Danger (Not interested): 0 84% 60%
- Info (General question): 199 89% 48%
- Referral: 271 91% 65%

**Neutral Palette (Dark Mode Primary)**:
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 215 20% 25%
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%

### B. Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts CDN)
- Monospace: 'JetBrains Mono', monospace (for data/codes)

**Type Scale**:
- Display (Dashboard headers): text-3xl font-bold
- Headers (Section titles): text-xl font-semibold
- Body (Main content): text-sm font-medium
- Small (Metadata): text-xs font-normal
- Data tables: text-sm font-mono for numbers/IDs

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Micro spacing: gap-1, gap-2 (button groups, inline elements)
- Component spacing: p-4, p-6 (cards, forms)
- Section spacing: py-8, py-12 (dashboard sections)
- Major spacing: mt-16 (page separators)

**Grid System**:
- Sidebar navigation: w-64 fixed left
- Main content: flex-1 with max-w-7xl container
- Data tables: Full width with horizontal scroll on mobile
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Navigation**:
- Top bar: Fixed header with search, notifications, user profile (h-16)
- Sidebar: Collapsible navigation with grouped menu items, active state with accent border-l-4

**Data Display**:
- Contact cards: Compact cards with avatar, name, company, status badge, last contact date
- Pipeline stages: Horizontal kanban-style columns with drag-drop (visual only)
- Activity timeline: Vertical timeline with icons for email, call, meeting, note
- Status badges: Pill-shaped with semantic colors, text-xs uppercase tracking-wide

**Forms & Inputs**:
- Input fields: border rounded-lg with focus ring-2 ring-primary/50
- Template builder: Rich text editor area with toolbar
- Multi-select: Checkbox groups with search filter for large lists
- Date/time picker: Calendar overlay with time slots visualization

**Tables**:
- Prospect list: Sortable columns, inline actions, row hover state bg-surface/50
- Column headers: Sticky position with sort indicators
- Row actions: Dropdown menu revealed on hover (three-dot icon)
- Pagination: Bottom-right with page numbers and rows per page selector

**Modals & Overlays**:
- Scheduling modal: Two-column layout (calendar + time slots), backdrop-blur-sm
- Contact details: Slide-over panel from right (w-96) with close button
- AI response preview: Floating card with classification confidence meter

**Dashboard Widgets**:
- Stat cards: Icon + number + trend indicator (arrow up/down)
- Recent activity feed: Scrollable list with avatars and timestamps
- Campaign performance: Bar chart with touchpoint breakdown
- Next actions: Prioritized task list with due dates

### E. AI-Powered Elements

**Response Classification UI**:
- Classification cards with confidence percentage and icon
- Color-coded by intent type (interested=green, question=blue, referral=purple)
- Quick action buttons contextual to classification

**Template Suggestions**:
- AI-generated templates shown in card format with preview
- "Refine with AI" button for template optimization
- Tone selector: Professional / Friendly / Urgent

**Smart Scheduling**:
- Calendar availability shown with 24hr gap enforcement (grayed out slots)
- Auto-suggest best times based on prospect timezone
- Meeting description pre-filled with custom message

### F. Interactions

**Micro-interactions** (minimal, purposeful):
- Status badge pulse on update
- Smooth slide transitions for panels (300ms ease-in-out)
- Checkbox check animation
- Loading skeleton screens for data fetching

**State Management**:
- Disabled states: opacity-50 cursor-not-allowed
- Loading states: Spinner with "Processing..." text
- Empty states: Icon + heading + descriptive text + CTA
- Error states: Alert banner with dismiss option

## Critical Implementation Notes

- **Icons**: Font Awesome via CDN (for CRM standard icons: envelope, phone, calendar, user, chart)
- **Data visualization**: Use Chart.js for dashboard analytics
- **No hero sections**: This is a dashboard application, not marketing
- **Mobile responsive**: Sidebar collapses to hamburger, tables scroll horizontally, forms stack vertically
- **Accessibility**: All status conveyed with both color AND icon/text, keyboard navigation for all actions