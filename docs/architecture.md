# Hotel PMS Architecture

## Design Philosophy: Local-First
The primary constraint was **unreliable internet**. Thus, the system is designed to be fully functional without any internet connection. 
- **Source of Truth**: The Local SQLite database is the master for Room Status and Walk-in bookings.
- **Sync**: A background worker syncs changes to the cloud when internet is available.

## Components & Stacks

### 1. Local PMS (Desktop App)
- **Runtime**: Electron (wraps Node.js + Browser). 
- **Frontend**: React (Vite) - Chosen for component reusability and fast development.
- **Backend**: Express (running locally on port 3001) - Handles API requests from the UI.
- **Database**: SQLite (`local-pms/db/hotel.db`) - File-based, zero-configuration SQL database perfect for single-system local apps.
- **Sync Worker**: A background loop in the Express server that pushes dirty rows and pulls updates.

### 2. Cloud API (Backend)
- **Runtime**: Node.js + Express.
- **Database**: PostgreSQL - Reliable relational DB for the cloud. Mirrors the local schema.
- **Role**: 
    1. Agregates data from the local PMS.
    2. Serves availability to the Booking Engine.
    3. Handles Razorpay webhooks.

### 3. Booking Engine (Public Website)
- **Runtime**: Next.js (Server Side Rendering).
- **Role**: SEO-friendly public site for guests.
- **Data Flow**: Fetches availability from Cloud API. Pushes new bookings to Cloud DB.

## Sync Protocol
1. **Dirty Flags**: Every table has a `sync_status` ('pending', 'synced') and a `version` number.
2. **Push**: Local PMS selects all `pending` records and sends them to `/api/sync/push`. On success, marks as `synced`.
3. **Pull**: Local PMS asks for changes since `last_synced_at`. Cloud returns records.
4. **Conflict Resolution**: 
   - **Local Wins** for Room Status updates (Front desk knows best).
   - **Merge** for new bookings (Appends cloud bookings to local DB).

## Folder Structure
```
hotel-pms/
├── local-pms/      # Everything running on the Front Desk Mac
│   ├── src/        # Backend logic & Database
│   ├── ui/         # React Frontend
│   └── main.js     # Electron Entry point
├── cloud-api/      # Deployed to AWS/DigitalOcean/Render
└── booking-engine/ # Next.js App (Vercel/Netlify)
```
