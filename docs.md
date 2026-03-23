# Roofing Contractor Management App
Developed by Team Summit

A role-based web application that allows homeowners to submit roofing job requests with photos and receive estimates from a contractor. Contractors manage incoming jobs through a dashboard with workflow statuses (Requested to Completed) and timestamps for each stage.

## Quick Start
1. cd contractor-app
2. npm install
3. npm run dev
4. Open the local URL printed in terminal

## Admin Login (Demo)
- Route: /admin-login
- Email: admin@teamsummitroofing.com
- Password: roofing123

## Current Routes
- / : public request form
- /admin-login : contractor/admin login
- /contractor : admin dashboard (protected)
- /contractor/jobs/:id : job details (protected)

## Team Responsibilities
- Client UI & Forms – 
- Contractor Dashboard -
- Database & Architecture –

## Branching Strategy
- main: stable production-ready branch
- dev: integration branch
- feature/*: individual feature branches merged into dev
- PR flow: feature/* -> dev, then dev -> main