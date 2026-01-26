const express = require('express');
const cors = require('cors');
const { query } = require('./src/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Public Booking Engine Routes ---

// Create Booking (from Website)
app.post('/api/bookings', async (req, res) => {
    const { guest_name, guest_phone, guest_email, rooms, check_in, check_out, total_amount, payment_id } = req.body;
    // Note: Transaction logic would go here
    try {
        // 1. Create/Find Guest
        let guest_id = uuidv4();
        // Simple check if exists or create new logic omitted for brevity
        await query(
            `INSERT INTO guests (id, name, phone, email) VALUES ($1, $2, $3, $4) RETURNING id`,
            [guest_id, guest_name, guest_phone, guest_email]
        );

        // 2. Create Booking
        const booking_id = uuidv4();
        // Assuming single room for MVP simplicity in this endpoint, but 'rooms' array suggests multiple. 
        // Let's just book the first room type for now.
        const room_type_id = rooms[0].room_type_id;

        await query(
            `INSERT INTO bookings (id, guest_id, check_in, check_out, total_amount, source, payment_status, razorpay_order_id)
             VALUES ($1, $2, $3, $4, $5, 'web', 'paid', $6)`,
            [booking_id, guest_id, check_in, check_out, total_amount, payment_id]
        );

        // 3. Log Payment
        if (payment_id) {
            await query(
                `INSERT INTO payment_logs (id, booking_id, razorpay_payment_id, amount, status)
                  VALUES ($1, $2, $3, $4, 'captured')`,
                [uuidv4(), booking_id, payment_id, total_amount]
            );
        }

        res.status(201).json({ booking_id, status: 'confirmed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Available to create booking' });
    }
});


// --- Sync Routes (For Local PMS) ---

// 1. PUSH: Local sends dirty records
app.post('/api/sync/push', async (req, res) => {
    const { changes } = req.body; // Expects { rooms: [], bookings: [], guests: [] }
    // Loop through changes and upsert into Postgres
    // "Last Write Wins" or more complex resolution strategy.

    try {
        await query('BEGIN');

        // Example: Sync Guests
        if (changes.guests) {
            for (const g of changes.guests) {
                await query(
                    `INSERT INTO guests (id, name, phone, email, version)
                     VALUES ($1, $2, $3, $4, $5)
                     ON CONFLICT (id) DO UPDATE SET
                     name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email, version = EXCLUDED.version, updated_at = NOW()`,
                    [g.id, g.name, g.phone, g.email, g.version]
                );
            }
        }

        // Example: Sync Bookings
        if (changes.bookings) {
            for (const b of changes.bookings) {
                await query(
                    `INSERT INTO bookings (id, guest_id, room_id, check_in, check_out, status, total_amount, version)
                      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                      ON CONFLICT (id) DO UPDATE SET
                      status = EXCLUDED.status, room_id = EXCLUDED.room_id, version = EXCLUDED.version, updated_at = NOW()`,
                    [b.id, b.guest_id, b.room_id, b.check_in, b.check_out, b.status, b.total_amount, b.version]
                );
            }
        }

        await query('COMMIT');
        res.json({ status: 'ok', synced_at: new Date() });
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Sync failed' });
    }
});

// 2. PULL: Local requests updates since last sync
app.get('/api/sync/pull', async (req, res) => {
    const { last_synced_at } = req.query;
    const timestamp = last_synced_at || '1970-01-01'; // Postgres timestamp

    try {
        const guests = await query(`SELECT * FROM guests WHERE updated_at > $1`, [timestamp]);
        const bookings = await query(`SELECT * FROM bookings WHERE updated_at > $1`, [timestamp]);
        const rooms = await query(`SELECT * FROM rooms WHERE updated_at > $1`, [timestamp]);

        res.json({
            guests: guests.rows,
            bookings: bookings.rows,
            rooms: rooms.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Pull failed' });
    }
});


// --- Owner Dashboard API ---
app.get('/api/dashboard', async (req, res) => {
    // Aggregation queries
    try {
        const todayRevenue = await query(`SELECT SUM(total_amount) as total FROM bookings WHERE date(created_at) = CURRENT_DATE`);
        const occupancy = await query(`SELECT COUNT(*) as occupied FROM rooms WHERE status = 'occupied'`);

        res.json({
            revenue: todayRevenue.rows[0].total || 0,
            occupancy: occupancy.rows[0].occupied || 0
        });
    } catch (err) {
        res.status(500).json({ error: 'Dashboard error' });
    }
});

app.listen(PORT, () => {
    console.log(`Cloud API running on port ${PORT}`);
});
