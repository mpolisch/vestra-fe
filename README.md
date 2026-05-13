# Vestra - Frontend

Vestra is an AI-powered retirement planning tool for Canadians. Input your financial details, visualize your retirement projection, and chat with an AI assistant that understands your actual plan.

Live App: https://vestra-chi.vercel.app
Live Backend API: https://vestra-be-production.up.railway.app
Backend Repo: [vestra-be](https://github.com/mpolisch/vestra-be)

--- 

## The Problem

Most Canadians don't know if they're saving enough for retirement or how to allocate across TFSA, RRSP, and FHSA. Generic financial calculators give numbers without context - no personaized, plain-English guidance.

## Target Users

- Working Canadians aged 18-50 planning for retirement
- People who want simple projections without hiring a financial advisor

## User Stories


| As a...   | I want to...                                  | So that...                                          |
| --------- | --------------------------------------------- | --------------------------------------------------- |
| New user  | Create an account and input my financial info | I can get a personalized retirement projection      |
| User      | See a chart of my projected balance over time | I can visualize if I'm on track                     |
| User      | Ask plain-English questions about my plan     | I can understand what the numbers mean              |
| User      | Update my monthly contribution                | I can see how small changes affect my retirement    |
| User      | Save multiple plans                           | I can compare different retirement scenarios        |

---

## Architecture

![Architecture diagram showing a user/browser communicating over HTTPS with a Next.js frontend hosted on Vercel, which communicates via HTTPS/REST with an Express API hosted on Railway. The Express API connects to a PostgreSQL database within the same Railway environment via TCP, and to the Claude API (Anthropic) externally via HTTPS using the Anthropic SDK.](public/Vestra%20Architecture.jpg)

API requests are proxied through Vercel rewrites (`/api/*` -> Railway) to avoid cross-domain cookie issues with httpOnly JWT cookies.

---

## Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Framework | Next.js 16 (App Router)           |
| Language  | TypeScript                        |
| Styling   | Tailwind CSS v4                   |
| Forms     | React Hook Form + Zod             |
| Charts    | Recharts                          |
| Markdown  | react-markdown + @tailwindcss/typography |
| Auth      | httpOnly JWT cookies (via BE)     |
| Hosting   | Vercel                            |

--- 

## Getting Started

### Requirements

- Node.js 20+
- npm
- vestra-be running locally

### Installation

```bash
git clone https://github.com/mpolisch/vestra-fe.git
cd vestra-fe
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values

### Running on Development Server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

---

## Running on Production Server

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run typecheck` | TypeScript type check without emitting |

--- 

## Design Decisions

- Vercel rewrite proxy: all API calls route through `/api/*` on the Vercel domain proxied to Railway
- Projection logic is performed on the backend so the frontend never performs financial calculations
- httpOnly cookies: JWT never touches JavaScript
- Optimistic UI: plan create / update / delete updates local state immediately without fetching. Same with user messages for AI chat
- AI Chat context: all messages contain a freshly fetched system prompt with theuser's current plan data and projection summary so Claude always has live numbers

---

## Security

- Authentication handled via httpOnly, Secure, SameSite=none cookies
- All API requests proxied through vercel so there are no direct cross-origin requests from the browser
- No sensitive data stored in localStorage or sessionStorage
- Security headers configured in next.config.ts
- robots.txt disallows all crawlers
- Error messages gated in production

---

## Future Enhancements

- AI streaming responses: SSE-based streaming for real-time chat feel instead of waiting for full response
- AI tool use: allow Claude to call projection recalculation and plan update functions mid-conversation
- Streaming "what if" scenarios: adjust plan values in chat and see projection update in real-time
- CRA contribution limits UI: show remaining TFSA/RRSP/FHSA room based on user's age and history
- Post-retirement drawdown modeling: visualize portfolio longevity based on spending rate
- PDF export: downloadable retirement plan summary
- Mobile-responsive polish: current UI is desktop-first
- PlanFields shared component: consolidate OnboardingForm and PlanForm which share identical field structure
- React Testing Library + Vitest: component tests for forms and projection display
- Email verification: verify email on registration
- Password reset flow: forgot password via email link
- First and last name: add to registration and display in NavBar

--- 

## Known Limitations

- Chat history might reference stale plan data if the user edits the plan mid-conversation
- Mobile UI is functional but not optimized
- Currency formatting assumes CAD, no multi-currency support
- Rate limiting is IP-based and in-memory: hitting auth rate limit during active use can cause UI to hang on a loading state if within a protected route. Refreshing the page resolves it.
