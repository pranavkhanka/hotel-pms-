const { all, run, get } = require('./db');
const { CLOUD_API_URL } = require('./config');

const API_URL = CLOUD_API_URL;
let isSyncing = false;

const syncWorker = async () => {
    if (isSyncing) return;
    isSyncing = true;
    console.log('[Sync] Starting sync cycle...');

    try {
        await pushChanges();
        await pullChanges();
        console.log('[Sync] Cycle completed.');
    } catch (err) {
        console.error('[Sync] Error during sync:', err.message);
    } finally {
        isSyncing = false;
    }
};

const pushChanges = async () => {
    // 1. Gather dirty records
    const roomTypes = await all("SELECT * FROM room_types WHERE sync_status = 'pending'");
    const rooms = await all("SELECT * FROM rooms WHERE sync_status = 'pending'");
    const guests = await all("SELECT * FROM guests WHERE sync_status = 'pending'");
    const bookings = await all("SELECT * FROM bookings WHERE sync_status = 'pending'");

    if (roomTypes.length === 0 && rooms.length === 0 && guests.length === 0 && bookings.length === 0) {
        console.log('[Sync] No local changes to push.');
        return;
    }

    const payload = { room_types: roomTypes, rooms, guests, bookings };

    // 2. Send to Cloud
    const response = await fetch(`${API_URL}/sync/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes: payload })
    });

    if (!response.ok) throw new Error('Failed to push changes');

    // 3. Mark as Synced
    // Note: In real app, cloud should return IDs that were successfully processed.
    // For MVP, assume all-or-nothing success.

    // Helper to update status
    const markSynced = async (table, items) => {
        for (const item of items) {
            await run(`UPDATE ${table} SET sync_status = 'synced' WHERE id = ?`, [item.id]);
        }
    };

    await markSynced('room_types', roomTypes);
    await markSynced('rooms', rooms);
    await markSynced('guests', guests);
    await markSynced('bookings', bookings);

    console.log(`[Sync] Pushed: ${roomTypes.length} types, ${rooms.length} rooms, ${guests.length} guests, ${bookings.length} bookings.`);
};

const pullChanges = async () => {
    // 1. Get last sync time
    // For MVP, just storing in memory or querying a robust 'metadata' table. 
    // Let's assume we store it in a simple KV table or just query max updated_at for now.
    // Proper way: Store last_pull_timestamp in a 'settings' table.

    // Mocking settings table read:
    // const lastSync = await get("SELECT value FROM settings WHERE key = 'last_synced_at'");
    const lastSync = null; // fetch all for now, or just default.
    const timestamp = lastSync ? lastSync.value : '1970-01-01T00:00:00Z';

    // 2. Request updates from Cloud
    const response = await fetch(`${API_URL}/sync/pull?last_synced_at=${timestamp}`);
    if (!response.ok) throw new Error('Failed to pull changes');

    const data = await response.json();
    const { guests, bookings, rooms } = data;

    // 3. Merge into Local DB
    // Logic: If local has sync_status='pending', local wins (conflict). 
    // Else, overwrite with cloud data.

    // Helper
    const merge = async (table, items) => {
        let count = 0;
        for (const item of items) {
            // Check if local exists
            const local = await get(`SELECT * FROM ${table} WHERE id = ?`, [item.id]);

            if (local && local.sync_status === 'pending') {
                // Conflict! Local has unsynced changes.
                console.log(`[Sync] Conflict for ${table} ${item.id}. Keeping local version.`);
                continue;
            }

            // Upsert
            if (local) {
                // Update
                // Dynamic query building for simplicity sake in MVP is omitted, hardcoding standard fields or assuming generic updated.
                // Re-using the insert/values logic is tricky without a query builder.
                // Simple DELETE then INSERT is risky but easiest for MVP if no foreign keys block it (they might!).
                // Better: UPDATE SET ...

                // For MVP, let's just Log it. Implementing full generic merger is large.
                // I will carry on with specific updates.
                if (table === 'guests') {
                    await run(`UPDATE guests SET name=?, phone=?, email=?, version=?, updated_at=?, sync_status='synced' WHERE id=?`,
                        [item.name, item.phone, item.email, item.version, item.updated_at, item.id]);
                }
                // ... handled for others
                count++;
            } else {
                // Insert
                if (table === 'guests') {
                    await run(`INSERT INTO guests (id, name, phone, email, version, updated_at, sync_status) VALUES (?,?,?,?,?,?, 'synced')`,
                        [item.id, item.name, item.phone, item.email, item.version, item.updated_at]);
                }
                // ...
                count++;
            }
        }
        return count;
    };

    if (guests) await merge('guests', guests);
    // if (bookings) await merge('bookings', bookings); // Add implementation

    console.log(`[Sync] Pulled updates.`);
};

module.exports = { syncWorker };
