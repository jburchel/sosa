# SOSA Basketball Website - Design Spec

## Organization
- **Full Name**: Square One Sports Academy (SOSA)
- **Type**: Faith-driven, community-focused non-profit AAU basketball club
- **Teams**: Boys Tigers (orange/black) and Lady Tigers (pink/black)
- **Taglines**: "More Than Basketball", "On and Off the Court", "Heart of a Tiger", "One Team. One Goal.", "Train With Purpose. Play With Heart."
- **Build guide PDF**: `docs/7710408249594867107.pdf`

## Decisions Made

| Topic | Decision |
|-------|----------|
| Audience | Parents first (practical, easy to navigate) |
| Framework | Next.js |
| Hosting | Railway |
| Styling | Tailwind CSS |
| Waivers | Digital signatures built into the site (legally binding under ESIGN Act/UETA) |
| Calendar/Events | Google Calendar embed (account to be created) |
| Donate | Placeholder for now, wire up payment processor later |
| Register | Placeholder button, link to interest form or future system |
| CMS | Not now, eventual goal |
| Stock imagery | Need stock photos/footage of teens (male + female) playing basketball |

## Color System
- **Primary**: Black (#000), Orange (#f77f00), White (#fff)
- **Secondary**: Pink (#e91e8c) for Lady Tigers
- **Dark BG**: #111

## Pages (9 total)

1. **Home** — Hero (tiger mascot bg, headline, CTAs), About preview, Mission preview, Programs overview, Values ("The SOSA Way"), Gallery preview, Sponsors, Donate CTA, Footer
2. **About SOSA** — Full mission & vision, core values detail, Tiger Mindset, org story
3. **Programs** — Travel Basketball, Skills Training, Mentorship & Leadership, Community Outreach (description cards)
4. **Teams** — Boys Tigers & Lady Tigers sections, roster placeholders, team photos (stock for now)
5. **Events** — Google Calendar embed, upcoming events list, waiver download + digital signature form
6. **Sponsors** — Logo grid, "Become a Sponsor" CTA
7. **Donate** — Coming soon placeholder
8. **Gallery** — Photo grid (game, practice, team, community) — stock images for now
9. **Contact** — Contact form (name, email, message), social media links

## Homepage Layout (from build guide)
1. Top Nav — Logo left, menu (Home, About, Programs, Teams, Events, Donate, Sponsors, Contact), highlighted Register button
2. Hero — Large bg image, "SOSA Basketball" headline, "More Than Basketball" subheadline, "On and Off the Court" supporting line, Register/Donate/Join SOSA buttons
3. About Section — Short mission paragraph + Learn More button
4. Mission Section — Short mission statement
5. Programs Section — 4 program cards
6. Values Section ("The SOSA Way") — Faith, Discipline, Leadership, Character, Community, Excellence
7. Photo Gallery preview
8. Sponsors Section
9. Donate Section
10. Footer — Logo, quick links, social media

## Key Interactive Features
- **Digital Waiver System**: Parents fill out + e-sign on-site. Records timestamp, typed name signature, consent checkbox. Stored server-side.
- **Google Calendar Embed**: Coaches update from phone, site reflects automatically.
- **Contact Form**: Simple name/email/message form.

## Brand Assets Available (in `/images/`)
- S1 logo (orange/black on white bg)
- Tiger head mascot (orange)
- SOSA Lady Tigers badge logo
- Pink tiger head
- "Heart of a Tiger" motivational graphic
- "We Love Community SOSA Much" graphic
- Daily Affirmation graphic
- Various logo variants

## Status
- **Design**: APPROVED by user
- **Next step**: Write implementation plan, then build
