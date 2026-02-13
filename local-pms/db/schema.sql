-- Local SQLite Schema
-- Designed for Offline-First Sync

-- 1. Room Types (Deluxe,super deluxe,luxury)
CREATE TABLE IF NOT EXISTS room_types (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    base_price REAL NOT NULL,
    gst_percent REAL DEFAULT 12.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    -- Sync fields
    version INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'pending', -- 'pending', 'synced'
    deleted INTEGER DEFAULT 0
);

-- 2. Rooms (101, 102, etc.)
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    room_type_id TEXT NOT NULL,
    status TEXT DEFAULT 'vacant', -- 'vacant', 'occupied', 'dirty', 'maintenance'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'pending',
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(room_type_id) REFERENCES room_types(id)
);

-- 3. Guests
CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    id_proof_type TEXT, -- 'aadhar', 'passport', etc.
    id_proof_number TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'pending',
    deleted INTEGER DEFAULT 0
);

-- 4. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    guest_id TEXT NOT NULL,
    room_id TEXT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'checked_in', 'checked_out', 'cancelled'
    total_amount REAL DEFAULT 0,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'partial', 'paid'
    source TEXT DEFAULT 'walk_in', -- 'walk_in', 'web', 'ota'
    num_guests INTEGER DEFAULT 1,
    num_rooms INTEGER DEFAULT 1,
    advance_deposit REAL DEFAULT 0,
    arrival_time TEXT, -- 'HH:MM'
    checkout_time TEXT, -- 'HH:MM'
    cloud_booking_id TEXT, -- Reference to cloud ID if synced from web
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'pending',
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(guest_id) REFERENCES guests(id),
    FOREIGN KEY(room_id) REFERENCES rooms(id)
);

-- 5. Transactions (Billing/Payments)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL, -- 'payment', 'refund', 'charge' (e.g. room charge, food)
    method TEXT, -- 'cash', 'card', 'upi'
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'pending',
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
);

-- 6. Sync Queue (Log of defining actions to replay if needed, though state-based sync is often robust enough, this helps debug)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
