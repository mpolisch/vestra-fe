# Vestra - Frontend

Vestra is an AI-powered retirement planning tool for Canadians. Input your financial details, visualize your retirement projection, and chat with an AI assistant that understands your actual plan.

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

---

## Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Framework | Next.js 16 (App Router)           |
| Language  | TypeScript                        |
| Styling   | Tailwind CSS                      |
| Charts    | TBD                               |
| Auth      | httpOnly JWT cookies (via BE)     |
| Hosting   | Vercel                            |

---

## Related Repo

Backend API: [vestra-be](https://github.com/mpolisch/vestra-be)

--- 

## Getting Started

### Requirements

- Node.js 20+
- npm
- The backend API running locally

### Installation

```bash
git clone https://github.com/mpolisch/vestra-fe.git
cd vestra-fe
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values

### Running Locally

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

--- 

## Security

- Authentication handled via httpOnly, Secure, SameSite=Strict cookies
- All API requests include `credentials: 'include'` for cookie forwarding
- No sensitive data stored in localStorage or sessionStorage

---

## Future Enhancements

- Email verification on registration
- Password reset flow
- Multi-scenario plan comparison view
- PDF export of retirement projection
- Mobile-responsive polish

