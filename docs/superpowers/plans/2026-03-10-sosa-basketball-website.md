# SOSA Basketball Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Square One Sports Academy (SOSA) basketball club website — a 9-page informational site with digital waiver signing, Google Calendar embed, and contact form.

**Architecture:** Next.js App Router with Tailwind CSS, deployed on Railway. Static content pages with server-side API routes for waiver submission and contact form. File-based storage for signed waivers (Railway volume). Google Calendar iframe embed for events.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, TypeScript

---

## File Structure

```
verna-site/
├── public/
│   └── images/                    # Brand assets (moved from /images/)
│       ├── s1-logo.png            # S1 logo (renamed from IMG_..._155600.png)
│       ├── tiger-mascot.jpg       # Tiger head mascot (renamed from IMG_..._155535.jpg)
│       ├── heart-of-tiger.jpg     # Motivational graphic (renamed from IMG_..._155547.jpg)
│       ├── community.jpg          # Community graphic (renamed from IMG_..._155554.jpg)
│       ├── sosa-tigers-badge.png  # SOSA Tigers badge (renamed from IMG_..._155606.png)
│       ├── sosa-lady-tigers.png   # Lady Tigers badge (renamed from IMG_..._155611.png)
│       ├── lady-tigers-alt.png    # Lady Tigers alternate (renamed from IMG_..._155615.png)
│       ├── tiger-basketball.png   # Tiger with basketball (renamed from IMG_..._155619.png)
│       ├── pink-tiger-dark.png    # Pink tiger on dark bg (renamed from IMG_..._155625.png)
│       ├── pink-tiger-light.png   # Pink tiger on light bg (renamed from IMG_..._155630.png)
│       └── daily-affirmation.png  # Daily affirmation graphic (renamed from IMG_..._155635.png)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: Navbar + Footer wrapper, fonts, metadata
│   │   ├── page.tsx               # Homepage: hero, about, mission, programs, values, gallery preview, sponsors, donate CTA
│   │   ├── about/
│   │   │   └── page.tsx           # About: full mission/vision, core values, Tiger Mindset
│   │   ├── programs/
│   │   │   └── page.tsx           # Programs: 4 program cards with descriptions
│   │   ├── teams/
│   │   │   └── page.tsx           # Teams: Boys Tigers + Lady Tigers sections
│   │   ├── events/
│   │   │   └── page.tsx           # Events: Google Calendar embed + waiver section
│   │   ├── sponsors/
│   │   │   └── page.tsx           # Sponsors: logo grid + become a sponsor CTA
│   │   ├── donate/
│   │   │   └── page.tsx           # Donate: coming soon placeholder
│   │   ├── gallery/
│   │   │   └── page.tsx           # Gallery: photo grid
│   │   ├── contact/
│   │   │   └── page.tsx           # Contact: contact form + social links
│   │   └── api/
│   │       ├── waiver/
│   │       │   └── route.ts       # POST: accept signed waiver, store as JSON
│   │       └── contact/
│   │           └── route.ts       # POST: accept contact form submission
│   ├── components/
│   │   ├── Navbar.tsx             # Top nav: logo, menu links, Register button, mobile hamburger
│   │   ├── Footer.tsx             # Footer: logo, quick links, social media icons
│   │   ├── Hero.tsx               # Hero section: bg image, headline, subheadline, CTA buttons
│   │   ├── SectionHeading.tsx     # Reusable section heading with orange accent
│   │   ├── ProgramCard.tsx        # Program card: icon, title, description
│   │   ├── ValueCard.tsx          # Core value card: icon, name, description
│   │   ├── WaiverForm.tsx         # Client component: waiver fields + digital signature + submit
│   │   ├── ContactForm.tsx        # Client component: name/email/message form
│   │   └── GoogleCalendar.tsx     # Google Calendar iframe embed wrapper
│   └── lib/
│       └── constants.ts           # Colors, nav links, program data, values data, social links
├── data/
│   └── waivers/                   # Signed waiver JSON files (gitignored, Railway volume)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
└── Dockerfile                     # Railway deployment
```

---

## Chunk 1: Foundation — Scaffold, Theme, Shared Layout

### Task 1: Initialize Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/macbookair/dev/verna-site
git init
```

- [ ] **Step 2: Create Next.js project in current directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

When prompted about overwriting, say yes. This scaffolds the project with App Router, TypeScript, Tailwind, and src directory.

- [ ] **Step 3: Move and rename brand images to `public/images/`**

```bash
mkdir -p public/images
cp images/IMG_20260310_155600.png public/images/s1-logo.png
cp images/IMG_20260310_155535.jpg public/images/tiger-mascot.jpg
cp images/IMG_20260310_155547.jpg public/images/heart-of-tiger.jpg
cp images/IMG_20260310_155554.jpg public/images/community.jpg
cp images/IMG_20260310_155606.png public/images/sosa-tigers-badge.png
cp images/IMG_20260310_155611.png public/images/sosa-lady-tigers.png
cp images/IMG_20260310_155615.png public/images/lady-tigers-alt.png
cp images/IMG_20260310_155619.png public/images/tiger-basketball.png
cp images/IMG_20260310_155625.png public/images/pink-tiger-dark.png
cp images/IMG_20260310_155630.png public/images/pink-tiger-light.png
cp images/IMG_20260310_155635.png public/images/daily-affirmation.png
```

- [ ] **Step 4: Add project-specific entries to `.gitignore`**

Append to `.gitignore`:
```
data/waivers/
.superpowers/
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000 with default Next.js page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind CSS"
```

---

### Task 2: Configure Theme and Constants

**Files:**
- Modify: `tailwind.config.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Extend Tailwind config with SOSA brand colors**

In `tailwind.config.ts`, add custom colors under `theme.extend.colors`:

```ts
colors: {
  sosa: {
    black: '#000000',
    orange: '#f77f00',
    white: '#ffffff',
    pink: '#e91e8c',
    dark: '#111111',
    gray: '#1a1a1a',
  }
}
```

Also add a custom font family if desired (bold athletic style — use Inter or similar system font stack for now).

- [ ] **Step 2: Create constants file**

Create `src/lib/constants.ts` with:

```ts
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programs', href: '/programs' },
  { label: 'Teams', href: '/teams' },
  { label: 'Events', href: '/events' },
  { label: 'Donate', href: '/donate' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export const PROGRAMS = [
  {
    title: 'Travel Basketball Teams',
    description: 'Competitive AAU travel teams for boys and girls across multiple age groups.',
  },
  {
    title: 'Basketball Skills Training',
    description: 'Structured training programs focused on fundamentals, conditioning, and game IQ.',
  },
  {
    title: 'Mentorship & Leadership',
    description: 'Character development, academic accountability, and positive role modeling.',
  },
  {
    title: 'Community Outreach',
    description: 'Service projects and community events that teach giving back and social responsibility.',
  },
];

export const CORE_VALUES = [
  { name: 'Faith', description: 'Putting God first in all we do' },
  { name: 'Character', description: 'Doing the right thing on and off the court' },
  { name: 'Discipline', description: 'Developing work ethic and accountability' },
  { name: 'Leadership', description: 'Encouraging youth to lead and serve others' },
  { name: 'Community', description: 'Building a village that supports youth' },
  { name: 'Excellence', description: 'Striving to grow and improve every day' },
];

export const TIGER_MINDSET = [
  'I am strong. I am focused. I am relentless.',
  'I train with purpose. I play with heart. I lead with pride.',
  'I lift my teammates up and together we rise.',
  'No challenge is too big. No obstacle too tough.',
  'I am a Tiger — fearless, determined, and unstoppable.',
];

export const SOCIAL_LINKS = {
  facebook: '#',
  instagram: '#',
  twitter: '#',
};
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/lib/constants.ts
git commit -m "feat: add SOSA brand colors and site constants"
```

---

### Task 3: Build Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`

- [ ] **Step 1: Create Navbar component**

Build `src/components/Navbar.tsx`:
- SOSA S1 logo on the left (link to home)
- Horizontal nav links from `NAV_LINKS` constant (hidden on mobile)
- Orange "Register" button on the right (links to `#` placeholder)
- Mobile hamburger menu button that toggles a slide-out or dropdown menu
- Use `'use client'` directive for mobile menu toggle state
- Sticky/fixed to top with dark background (`bg-sosa-black`)
- Active link highlighting based on current pathname (use `usePathname()`)

- [ ] **Step 2: Verify in browser**

Navigate to localhost:3000. Navbar should render at top with logo, links, and Register button. Mobile: hamburger icon toggles menu.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add responsive Navbar with mobile menu"
```

---

### Task 4: Build Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create Footer component**

Build `src/components/Footer.tsx`:
- Dark background (`bg-sosa-black` or `bg-sosa-dark`)
- Left: SOSA S1 logo + "Square One Sports Academy" text
- Center: Quick links grid (same as nav links)
- Right: Social media icon links (Facebook, Instagram, Twitter) — use simple SVG icons or text links
- Bottom bar: Copyright notice "© 2026 Square One Sports Academy. All rights reserved."
- Tagline: "More Than Basketball"

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer with quick links and social media"
```

---

### Task 5: Wire Up Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update root layout**

Modify `src/app/layout.tsx`:
- Import and render `<Navbar />` above `{children}`
- Import and render `<Footer />` below `{children}`
- Set page metadata: title "SOSA Basketball | Square One Sports Academy", description from mission statement
- Set body background to black, text to white: `className="bg-black text-white"`
- Use a bold, athletic font (system stack or Google Fonts import for something like Oswald or Montserrat)

- [ ] **Step 2: Clear out default homepage**

Replace `src/app/page.tsx` with a minimal placeholder:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-sosa-orange">SOSA Basketball</h1>
    </main>
  );
}
```

- [ ] **Step 3: Verify in browser**

Navigate to localhost:3000. Should see: dark page with Navbar at top, "SOSA Basketball" centered, Footer at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: wire up root layout with Navbar and Footer"
```

---

### Task 6: Build Reusable SectionHeading Component

**Files:**
- Create: `src/components/SectionHeading.tsx`

- [ ] **Step 1: Create SectionHeading component**

```tsx
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
        {title}
      </h2>
      <div className="w-20 h-1 bg-sosa-orange mx-auto mt-4" />
      {subtitle && (
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHeading.tsx
git commit -m "feat: add reusable SectionHeading component"
```

---

## Chunk 2: Homepage

### Task 7: Build Hero Section

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Create Hero component**

Build `src/components/Hero.tsx`:
- Full-viewport-height section with dark overlay on background image
- Background: use one of the tiger brand images (e.g., `tiger-basketball.png`) or a dark gradient with the tiger mascot overlaid
- Centered content:
  - "SOSA BASKETBALL" in large bold text
  - "More Than Basketball" as subheadline in orange
  - "On and Off the Court" as supporting line
  - Three CTA buttons: "Register" (orange, solid), "Donate" (outlined), "Join SOSA" (outlined)
- Register and Donate buttons link to `#` (placeholders)
- Subtle animation on load (fade in or slide up via Tailwind `animate-` classes)

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero section with CTAs"
```

---

### Task 8: Build ProgramCard and ValueCard Components

**Files:**
- Create: `src/components/ProgramCard.tsx`
- Create: `src/components/ValueCard.tsx`

- [ ] **Step 1: Create ProgramCard**

```tsx
interface ProgramCardProps {
  title: string;
  description: string;
}

export default function ProgramCard({ title, description }: ProgramCardProps) {
  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg p-6 hover:border-sosa-orange transition-colors">
      <h3 className="text-xl font-bold text-sosa-orange mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
```

- [ ] **Step 2: Create ValueCard**

```tsx
interface ValueCardProps {
  name: string;
  description: string;
}

export default function ValueCard({ name, description }: ValueCardProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{name}</h3>
      <div className="w-10 h-0.5 bg-sosa-orange mx-auto mb-3" />
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProgramCard.tsx src/components/ValueCard.tsx
git commit -m "feat: add ProgramCard and ValueCard components"
```

---

### Task 9: Assemble Full Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build complete homepage**

Replace `src/app/page.tsx` with the full homepage layout, composing these sections in order:

1. **Hero** — `<Hero />` component
2. **About Preview** — Short paragraph about SOSA + "Learn More" button linking to `/about`
3. **Mission Preview** — Shortened mission statement in a styled blockquote or card
4. **Programs** — Section heading "Our Programs" + 4 `<ProgramCard />` in a 2x2 grid (from `PROGRAMS` constant)
5. **Values ("The SOSA Way")** — Section heading + 6 `<ValueCard />` in a 3x2 grid (from `CORE_VALUES` constant)
6. **Gallery Preview** — Section heading "Gallery" + placeholder grid of 4-6 image cards using brand assets + "View Gallery" button to `/gallery`
7. **Sponsors** — Section heading "Our Sponsors" + "Become a Sponsor" placeholder text
8. **Donate CTA** — Dark section with "Support Our Youth" heading, short text, "Donate" button linking to `/donate`

Each section gets generous vertical padding (`py-16` or `py-20`) and uses `max-w-6xl mx-auto px-4` for content width.

- [ ] **Step 2: Verify in browser**

Scroll through localhost:3000. All sections should render with proper spacing, brand colors, and responsive behavior on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build complete homepage with all sections"
```

---

## Chunk 3: Content Pages — About, Programs, Teams

### Task 10: About Page

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: Build About page**

Create `src/app/about/page.tsx` with sections:
1. Page header with "About SOSA" title
2. **Mission Statement** — Full text from build guide PDF
3. **Vision Statement** — Full text from build guide PDF
4. **Core Values** — 6 value cards in a grid with expanded descriptions
5. **Tiger Mindset** — Styled list of affirmations from `TIGER_MINDSET` constant (bold, motivational typography)
6. Brand imagery interspersed (tiger mascot, motivational graphics)

- [ ] **Step 2: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add About page with mission, vision, values, and Tiger Mindset"
```

---

### Task 11: Programs Page

**Files:**
- Create: `src/app/programs/page.tsx`

- [ ] **Step 1: Build Programs page**

Create `src/app/programs/page.tsx`:
1. Page header "Our Programs"
2. Four program sections, each with:
   - Program title
   - Expanded description (more detail than homepage cards)
   - Placeholder image or icon
3. Programs: Travel Basketball Teams, Basketball Skills Training, Mentorship & Leadership Development, Community Outreach Programs
4. CTA at bottom: "Ready to join? Contact us" linking to `/contact`

- [ ] **Step 2: Commit**

```bash
git add src/app/programs/page.tsx
git commit -m "feat: add Programs page with detailed program descriptions"
```

---

### Task 12: Teams Page

**Files:**
- Create: `src/app/teams/page.tsx`

- [ ] **Step 1: Build Teams page**

Create `src/app/teams/page.tsx`:
1. Page header "Our Teams"
2. **Boys Tigers** section:
   - Orange/black theme accent
   - SOSA Tigers badge image
   - Description text about the boys program
   - "Roster coming soon" placeholder
3. **Lady Tigers** section:
   - Pink/black theme accent
   - Lady Tigers badge image
   - Description text about the girls program
   - "Roster coming soon" placeholder
4. Stock imagery placeholders (note: actual stock photos to be sourced)
5. CTA: "Interested in joining? Contact us"

- [ ] **Step 2: Commit**

```bash
git add src/app/teams/page.tsx
git commit -m "feat: add Teams page with Tigers and Lady Tigers sections"
```

---

## Chunk 4: Events, Calendar, and Waiver System

### Task 13: Google Calendar Embed Component

**Files:**
- Create: `src/components/GoogleCalendar.tsx`

- [ ] **Step 1: Create GoogleCalendar component**

```tsx
interface GoogleCalendarProps {
  calendarId?: string;
}

export default function GoogleCalendar({ calendarId }: GoogleCalendarProps) {
  if (!calendarId) {
    return (
      <div className="bg-sosa-gray border border-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-lg">Calendar coming soon</p>
        <p className="text-gray-600 mt-2">Check back for our practice and game schedule</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=America/New_York&bgcolor=%23000000`}
        style={{ border: 0 }}
        width="100%"
        height="600"
        title="SOSA Events Calendar"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GoogleCalendar.tsx
git commit -m "feat: add Google Calendar embed component with fallback"
```

---

### Task 14: Digital Waiver Form Component

**Files:**
- Create: `src/components/WaiverForm.tsx`

- [ ] **Step 1: Create WaiverForm client component**

Build `src/components/WaiverForm.tsx` with `'use client'`:

Form fields:
- Player full name (text input)
- Player date of birth (date input)
- Parent/Guardian full name (text input)
- Parent/Guardian email (email input)
- Parent/Guardian phone (tel input)
- Emergency contact name + phone
- Medical conditions / allergies (textarea, optional)
- **Waiver agreement text** — scrollable box with the waiver terms (assumption of risk, medical release, photo release)
- **Digital signature** — text input where parent types their full legal name as signature
- **Consent checkbox** — "I agree to the above terms and acknowledge this constitutes a legally binding electronic signature under the ESIGN Act."
- **Date** — auto-filled with current date (read-only)
- Submit button

On submit:
- Client-side validation (all required fields filled, signature matches parent name, checkbox checked)
- POST to `/api/waiver` with form data
- Show success message with timestamp confirmation
- Show error state if submission fails

- [ ] **Step 2: Commit**

```bash
git add src/components/WaiverForm.tsx
git commit -m "feat: add digital waiver form with e-signature"
```

---

### Task 15: Waiver API Route

**Files:**
- Create: `src/app/api/waiver/route.ts`
- Create: `data/waivers/.gitkeep`

- [ ] **Step 1: Create waiver API route**

Create `src/app/api/waiver/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const WAIVERS_DIR = path.join(process.cwd(), 'data', 'waivers');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['playerName', 'playerDob', 'parentName', 'parentEmail', 'parentPhone', 'emergencyName', 'emergencyPhone', 'signature'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate signature matches parent name
    if (body.signature.toLowerCase().trim() !== body.parentName.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Signature must match parent/guardian name' }, { status: 400 });
    }

    // Build waiver record
    const waiver = {
      ...body,
      signedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Ensure directory exists
    await fs.mkdir(WAIVERS_DIR, { recursive: true });

    // Save as JSON file with timestamp filename
    const filename = `waiver-${Date.now()}-${body.playerName.replace(/\s+/g, '-').toLowerCase()}.json`;
    await fs.writeFile(path.join(WAIVERS_DIR, filename), JSON.stringify(waiver, null, 2));

    return NextResponse.json({ success: true, signedAt: waiver.signedAt });
  } catch (error) {
    console.error('Waiver submission error:', error);
    return NextResponse.json({ error: 'Failed to process waiver' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create data directory**

```bash
mkdir -p data/waivers
touch data/waivers/.gitkeep
```

- [ ] **Step 3: Test the API route**

Start dev server, then use curl:

```bash
curl -X POST http://localhost:3000/api/waiver \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Test Player","playerDob":"2012-05-15","parentName":"Test Parent","parentEmail":"test@example.com","parentPhone":"555-0100","emergencyName":"Emergency Contact","emergencyPhone":"555-0200","signature":"Test Parent","consentChecked":true}'
```

Expected: `{"success":true,"signedAt":"..."}` and a JSON file appears in `data/waivers/`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/waiver/route.ts data/waivers/.gitkeep
git commit -m "feat: add waiver API route with file-based storage"
```

---

### Task 16: Events Page

**Files:**
- Create: `src/app/events/page.tsx`

- [ ] **Step 1: Build Events page**

Create `src/app/events/page.tsx`:
1. Page header "Events & Schedule"
2. **Calendar section** — `<GoogleCalendar />` component (no calendarId yet, shows placeholder)
3. **Upcoming Events** — Static placeholder section: "Events will be posted here. Follow us on social media for updates."
4. **Waivers section** — Heading "Player Waiver Form", explanation text about digital signing, then `<WaiverForm />` component

- [ ] **Step 2: Verify in browser**

Navigate to localhost:3000/events. Calendar placeholder should render, waiver form should display all fields and submit successfully.

- [ ] **Step 3: Commit**

```bash
git add src/app/events/page.tsx
git commit -m "feat: add Events page with calendar and digital waiver form"
```

---

## Chunk 5: Remaining Pages — Sponsors, Donate, Gallery, Contact

### Task 17: Sponsors Page

**Files:**
- Create: `src/app/sponsors/page.tsx`

- [ ] **Step 1: Build Sponsors page**

Create `src/app/sponsors/page.tsx`:
1. Page header "Our Sponsors"
2. Intro text: "SOSA Basketball is grateful for the support of our sponsors..."
3. Sponsor logo grid — empty state with placeholder cards: "Your Logo Here"
4. **Become a Sponsor** CTA section with description of sponsorship benefits and link to contact page

- [ ] **Step 2: Commit**

```bash
git add src/app/sponsors/page.tsx
git commit -m "feat: add Sponsors page with placeholder grid"
```

---

### Task 18: Donate Page

**Files:**
- Create: `src/app/donate/page.tsx`

- [ ] **Step 1: Build Donate page**

Create `src/app/donate/page.tsx`:
1. Page header "Support SOSA Basketball"
2. Mission-driven text about why donations matter
3. **Coming Soon** card: "Online donations coming soon. In the meantime, contact us to learn how you can support our youth programs."
4. Link to contact page
5. Styled with brand imagery (community graphic, tiger mascot)

- [ ] **Step 2: Commit**

```bash
git add src/app/donate/page.tsx
git commit -m "feat: add Donate page with coming soon placeholder"
```

---

### Task 19: Gallery Page

**Files:**
- Create: `src/app/gallery/page.tsx`

- [ ] **Step 1: Build Gallery page**

Create `src/app/gallery/page.tsx`:
1. Page header "Gallery"
2. Category filters (optional): "All", "Games", "Practice", "Team", "Community"
3. Responsive photo grid (CSS grid, 2-3-4 columns depending on breakpoint)
4. Use existing brand images as gallery content for now
5. Images displayed in cards with hover zoom effect
6. Note: Stock teen basketball photos and real team photos to be added later

- [ ] **Step 2: Commit**

```bash
git add src/app/gallery/page.tsx
git commit -m "feat: add Gallery page with responsive photo grid"
```

---

### Task 20: Contact Form Component

**Files:**
- Create: `src/components/ContactForm.tsx`

- [ ] **Step 1: Create ContactForm client component**

Build `src/components/ContactForm.tsx` with `'use client'`:

Fields:
- Full name (text)
- Email (email)
- Subject (text, optional)
- Message (textarea)
- Submit button

On submit:
- Client-side validation
- POST to `/api/contact`
- Success/error states displayed to user

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactForm.tsx
git commit -m "feat: add ContactForm component"
```

---

### Task 21: Contact API Route

**Files:**
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create contact API route**

Create `src/app/api/contact/route.ts`:
- Accept POST with name, email, subject, message
- Validate required fields
- For now, log to console and save to a JSON file in `data/` (can add email sending later)
- Return success response

- [ ] **Step 2: Commit**

```bash
git add src/app/api/contact/route.ts
git commit -m "feat: add contact form API route"
```

---

### Task 22: Contact Page

**Files:**
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: Build Contact page**

Create `src/app/contact/page.tsx`:
1. Page header "Contact Us"
2. Two-column layout (stacks on mobile):
   - Left: `<ContactForm />` component
   - Right: Contact info card — email, social media links, "Follow us" section
3. Optional: Simple map or location text if applicable

- [ ] **Step 2: Verify in browser**

Navigate to localhost:3000/contact. Form should display and submit successfully.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: add Contact page with form and info"
```

---

## Chunk 6: Polish and Railway Deployment

### Task 23: Responsive Polish Pass

**Files:**
- Modify: Various component files as needed

- [ ] **Step 1: Test all pages at mobile (375px), tablet (768px), and desktop (1280px)**

Check each page in browser dev tools at all three breakpoints. Fix any:
- Overflow issues
- Text too small on mobile
- Grid layouts not collapsing properly
- Nav menu behavior on mobile
- Images not scaling

- [ ] **Step 2: Commit fixes**

```bash
git add -A
git commit -m "fix: responsive layout polish across all pages"
```

---

### Task 24: Metadata and SEO

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: Each page file (add page-specific metadata exports)

- [ ] **Step 1: Add metadata to each page**

Each page file should export metadata:

```ts
export const metadata = {
  title: 'Page Name | SOSA Basketball',
  description: 'Page-specific description...',
};
```

Pages to update: About, Programs, Teams, Events, Sponsors, Donate, Gallery, Contact.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add page-specific SEO metadata"
```

---

### Task 25: Railway Deployment Setup

**Files:**
- Create: `Dockerfile`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p data/waivers && chown -R nextjs:nodejs data
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

- [ ] **Step 2: Update next.config.ts for standalone output**

Add to `next.config.ts`:

```ts
const nextConfig = {
  output: 'standalone',
};
```

- [ ] **Step 3: Test Docker build locally (optional)**

```bash
docker build -t sosa-basketball .
docker run -p 3000:3000 sosa-basketball
```

- [ ] **Step 4: Commit**

```bash
git add Dockerfile next.config.ts
git commit -m "feat: add Dockerfile and standalone output for Railway deployment"
```

- [ ] **Step 5: Deploy to Railway**

Push to GitHub repo, connect to Railway, deploy. Configure Railway volume mount for `/app/data` to persist waiver submissions.

---

## Summary

| Chunk | Tasks | What it delivers |
|-------|-------|-----------------|
| 1: Foundation | Tasks 1-6 | Scaffolded Next.js project, theme, Navbar, Footer, root layout |
| 2: Homepage | Tasks 7-9 | Complete homepage with all sections from build guide |
| 3: Content Pages | Tasks 10-12 | About, Programs, Teams pages |
| 4: Events + Waivers | Tasks 13-16 | Google Calendar embed, digital waiver form + API |
| 5: Remaining Pages | Tasks 17-22 | Sponsors, Donate, Gallery, Contact pages + APIs |
| 6: Polish + Deploy | Tasks 23-25 | Responsive fixes, SEO metadata, Railway deployment |
