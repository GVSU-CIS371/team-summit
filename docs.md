# Roofing Contractor Management App
Developed by Team Summit

A role-based web application that allows homeowners to submit roofing job requests with photos and receive estimates from a contractor. Contractors manage incoming jobs through a dashboard with workflow statuses (Requested to Completed) and timestamps for each stage.

## Quick Start
1. cd contractor-app
2. npm install
3. npm run dev
4. Open the local URL printed in terminal

## Contractor Login (Demo)
- Route: /contractor-login
- Email: the contractor business account email you registered
- Password: the password created during registration

## Register Contractor Business
1. Open /create-account
2. Set Account type to Contractor business
3. Fill in owner name, business name, services, service areas, availability, and pricing range
4. Submit Register Business
5. You will be signed in and redirected to /contractor

Registered contractor businesses are saved to Firestore and appear in the customer contractor matching list on the public request form.

## Current Routes
- / : public request form
- /contractor-login : contractor login
- /contractor : contractor dashboard (protected)
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