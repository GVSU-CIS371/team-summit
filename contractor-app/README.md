# Team Summit Roofing App

Vue 3 + Vite MVP for end-to-end roofing service requests.

## Implemented Workflow

1. Client enters location and selects service.
2. App shows nearby contractors that support the selected service.
3. Client reviews contractor profiles (ratings, services, availability, photos, pricing range).
4. Client selects contractor and preferred time slot.
5. Client submits request with description and photo attachments.
6. Contractor reviews request and either:
	- auto-accepts simple jobs, or
	- schedules inspection and then provides final estimate.
7. Client approves estimate.
8. Payment is secured in platform escrow.
9. Job is confirmed/scheduled and then completed.
10. Contractor submits completion notes, photos, and invoice.
11. Dispute window opens (72 hours in this demo).
12. Payment release rules:
	- client confirms job -> immediate release
	- no client action by deadline -> automatic/manual release
	- dispute filed -> hold payment, contractor response, platform resolution

## Demo Login Credentials

- Admin: `admin@teamsummitroofing.com` / `roofing123`
- Contractor: `contractor@teamsummitroofing.com` / `roofing123`

## Firebase Setup

1. Copy values into `.env` using your Firebase keys.
2. Required keys:
	- `VITE_FIREBASE_API_KEY`
	- `VITE_FIREBASE_AUTH_DOMAIN`
	- `VITE_FIREBASE_PROJECT_ID`
	- `VITE_FIREBASE_STORAGE_BUCKET`
	- `VITE_FIREBASE_MESSAGING_SENDER_ID`
	- `VITE_FIREBASE_APP_ID`
	- `VITE_FIREBASE_MEASUREMENT_ID` (optional)
3. Firebase initializes from `src/firebase.js` when keys are present.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
