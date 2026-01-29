const express = require('express');
const cors = require('cors');
const path = require('path');
const { run, all, get, initDb } = require('./src/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Routes (Skeleton) ---

// 1. Rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await all('SELECT r.*, rt.name as type_name, rt.base_price FROM rooms r JOIN room_types rt ON r.room_type_id = rt.id WHERE r.deleted = 0');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Bookings
app.post('/api/bookings', async (req, res) => {
    const { guest_id, room_id, check_in, check_out, total_amount, source } = req.body;
    const id = uuidv4();
    try {
        await run(
            `INSERT INTO bookings (id, guest_id, room_id, check_in, check_out, total_amount, source, sync_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [id, guest_id, room_id, check_in, check_out, total_amount, source]
        );
        res.status(201).json({ id, status: 'confirmed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Guests
app.post('/api/guests', async (req, res) => {
    const { name, phone, email, id_proof_number } = req.body;
    const id = uuidv4();
    try {
        await run(
            `INSERT INTO guests (id, name, phone, email, id_proof_number, sync_status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [id, name, phone, email, id_proof_number]
        );
        res.status(201).json({ id, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Sync Worker Placeholder ---
const runSync = async () => {
    console.log('[Sync Worker] Checking for changes...');
    // TODO: Implement syncing logic:
    // 1. Push: Select * from all tables where sync_status = 'pending'
    // 2. Pull: Fetch updates from cloud since last_synced_timestamp
};

const { syncWorker } = require('./src/sync');

// Start Sync Loop (every 1 minute)
setInterval(syncWorker, 60 * 1000);
// Initial sync on start
syncWorker();


// --- Start Server ---
app.listen(PORT, async () => {
    console.log(`Local PMS Server running on http://localhost:${PORT}`);
    // Auto-init DB on start for MVP simplicity
    await initDb();
});
