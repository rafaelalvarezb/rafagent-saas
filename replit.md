# RafAgent - Professional Outbound Sales Platform

## Overview
A full-stack web-based outbound sales CRM that automates 4-touchpoint email cadences, leverages Gemini AI for intelligent response classification, and schedules Google Meet appointments with timezone awareness. Built to replace the Google Sheets MVP with a modern, intuitive interface.

## Project Goal
Build a professional sales CRM platform that enables sales reps to:
- Manage prospect contacts with detailed tracking
- Execute automated email sequences using customizable templates  
- Leverage AI to classify prospect responses (Interested, Not Interested, Question, Referral, Bounce, Out-of-Office)
- Intelligently schedule Google Meet appointments with 24-hour preparation buffer
- Respect prospect time preferences and sales rep working hours
- Support multi-timezone operations (starting with Mexico City)

## Recent Changes
- **2025-10-18**: Initial project setup with database schema
  - Created comprehensive database schema for users, prospects, templates, campaigns, activity logs
  - Integrated Gmail connector for email sending and management
  - Integrated Google Calendar for meeting scheduling
  - Added Gemini AI integration for response classification
  - Set up Replit Auth for user authentication

## User Preferences
- **Design Style**: Minimalist, Salesforce Lightning-inspired with modern SaaS aesthetics
- **AI Provider**: Gemini AI (not OpenAI) for all AI features
- **Authentication**: Gmail login via Replit Auth
- **Target Timezone**: Mexico City (America/Mexico_City) as starting timezone, auto-detect from browser
- **Core Features from MVP**: Automated sequences, AI analysis, smart scheduling with 24hr buffer, referral extraction, work hours protection

## Project Architecture

### Tech Stack
- **Frontend**: React + TypeScript, Wouter (routing), TanStack Query (data fetching), Tailwind CSS + shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Integrations**: 
  - Replit Auth (user authentication with Gmail)
  - Gmail API (email sending/receiving via googleapis)
  - Google Calendar API (meeting scheduling)
  - Gemini AI (response classification)

### Database Schema
- **users**: User accounts with email, name, title, timezone
- **userConfig**: Per-user settings (working hours, touchpoint intervals, meeting preferences)
- **prospects**: Contact management with status tracking, email threads, scheduling preferences
- **templates**: Email templates with variable replacement (Initial, Follow-up 1-3, Referral-Initial)
- **activityLogs**: Audit trail of all agent actions
- **campaigns**: Campaign tracking and management

### Key Features
1. **Automated Email Sequences**
   - 4-touchpoint cadence with configurable intervals (default: 4 days)
   - Template variables: ${contactName}, ${companyName}, ${contactTitle}, ${industry}, ${yourName}, ${externalCID}
   - HTML email formatting with automatic Gmail signature
   - Threaded follow-ups (forwards to maintain conversation context)

2. **AI Response Classification**
   - Gemini AI analyzes prospect replies
   - Categories: INTERESTED, NOT_INTERESTED, REFERRAL, WRONG_EMAIL, OUT_OF_OFFICE, SIMPLE_QUESTION, BOUNCE
   - Extracts scheduling preferences (days, times, weeks)
   - Detects referrals and auto-creates new prospect records
   - Bounce detection (mailer-daemon/postmaster + AI confirmation)

3. **Intelligent Meeting Scheduling**
   - 24-hour preparation buffer before first available slot
   - Rounds to next clean 30-minute interval
   - Respects user's working hours (default: 9:00-17:00)
   - Checks calendar availability (only books when truly free)
   - Supports prospect's preferred days/times if specified
   - Creates Google Meet with customizable title/description

4. **Automated Agent Engine**
   - Runs on configurable intervals (default: every 2 hours)
   - Weekday-only execution (Monday-Friday)
   - Working hours protection
   - Timezone-aware scheduling
   - Instant pause/resume via checkbox (manual brake)

5. **Prospect Management**
   - Manual and bulk import capabilities
   - Status tracking with visual indicators
   - Thread link integration for Gmail
   - Referral handling with auto-prospect creation

### File Structure
```
client/src/
  ├── pages/          # Page components (Dashboard, Prospects, Templates, Settings)
  ├── components/     # Reusable UI components
  │   ├── ui/         # shadcn components
  │   └── AppSidebar.tsx
  └── lib/            # Utilities and API client

server/
  ├── routes.ts       # API endpoints
  ├── storage.ts      # Database interface
  ├── services/       # Business logic services
  │   ├── email.ts    # Gmail integration
  │   ├── ai.ts       # Gemini AI integration
  │   └── scheduler.ts # Calendar scheduling
  └── index.ts        # Server entry

shared/
  └── schema.ts       # Database schema and types
```

### Variable Replacement System
Templates support dynamic variables that work in subjects, bodies, and meeting details:
- `${contactName}` - Prospect's first name
- `${companyName}` - Prospect's company
- `${contactTitle}` - Prospect's job title
- `${industry}` - Prospect's industry
- `${yourName}` - Sales rep's name (from config)
- `${externalCID}` - External contact ID (for integrations)

### Status Values
- `Following up` - Active in sequence
- `✅ Interested - Schedule!` - AI classified as interested
- `❌ Not Interested` - AI classified as not interested
- `🤝 Referred to {email}` - Referral detected and new prospect created
- `🚫 Paused (Manual Stop)` - User unchecked Send Sequence
- `🚫 Sequence Finished` - All touchpoints sent, no response
- `Contact is OOO, manual FUP` - Out of office detected
- `❓ Question / Neutral` - Requires manual review
- `Bounce - Invalid Email` - Email bounced
- `🤖 Processing...` - AI analyzing or email sending

## Development Guidelines
- Follow fullstack_js guidelines for project structure
- Use PostgreSQL database (no in-memory storage)
- Implement timezone detection from browser
- Respect working hours configuration
- Log all agent actions to activity_logs table
- Use semantic status badges with colors from design_guidelines.md
