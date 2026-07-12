# TransitOps

Fleet management platform for coordinating vehicles, drivers, trips, maintenance, fuel, expenses, and costs — with role-based access control (RBAC).

## Tech Stack

- **Client**: React + TypeScript, Vite, Tailwind CSS
- **Server**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT (httpOnly cookie), role-based login

## Features

- JWT auth with role selection at login (Fleet Manager, Driver, Safety Officer, Financial Analyst)
- Vehicles, Drivers, Trips, Maintenance, Fuel Logs, Expenses — full CRUD
- Adding a driver also creates their login credentials, linked to their driver record
- Maintenance automatically flips a vehicle's status (`Available` ↔ `In Shop`)
- Expenses page combines maintenance costs + extra expenses (tolls, fines, etc.) with running totals
- Dashboard and Reports with fleet/fuel/cost analytics, CSV export
- Settings page: Fleet Manager can toggle which sidebar tabs are visible per role

## Project Structure

```
TransitOps/
├── client/     # React + Vite frontend
└── server/     # Express + MongoDB backend
```

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

Copy `server/.env.example` to `server/.env` and fill in:

```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
PORT=8000
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database (first run only)

```bash
cd server && node seed/seed.js
```

Creates one user per role, all with password `Passw0rd!`:

| Role | Email |
|---|---|
| Fleet Manager | fleetmanager@transitops.com |
| Driver | driver@transitops.com |
| Safety Officer | safety@transitops.com |
| Financial Analyst | finance@transitops.com |

### 4. Run

```bash
# terminal 1
cd server && npm run dev

# terminal 2
cd client && npm run dev
```

Open **http://localhost:5173**.

## Notes

- The client dev server proxies `/api` requests to the backend on port 8000 (see `client/vite.config.ts`).
- Only driver-mutation routes and a few others are auth-protected; most backend routes don't yet enforce login — don't expose this API publicly as-is.
