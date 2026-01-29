-- Cloud PostgreSQL Schema

-- 1. Room Types
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    gst_percent DECIMAL(5, 2) DEFAULT 12.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1
);

-- 2. Rooms
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id),
    status TEXT DEFAULT 'vacant', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1
);

-- 3. Guests
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    id_proof_type TEXT,
    id_proof_number TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1
);

-- 4. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY,
    guest_id UUID REFERENCES guests(id),
    room_id UUID REFERENCES rooms(id), -- Nullable if booking is just dates and room type, but sticking to specific room for simplicity or room_type based logic
    check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    check_out TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'confirmed', 
    total_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status TEXT DEFAULT 'pending',
    source TEXT DEFAULT 'web',
    razorpay_order_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1
);

-- 5. Payment Logs (Cloud only, for Razorpay webhooks/verification)
CREATE TABLE IF NOT EXISTS payment_logs (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    amount DECIMAL(10, 2),
    status TEXT, -- 'captured', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
