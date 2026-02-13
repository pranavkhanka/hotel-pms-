const { db } = require('./src/db');

const migrate = async () => {
    console.log('Starting migration...');

    const columns = [
        { name: 'num_guests', type: 'INTEGER DEFAULT 1' },
        { name: 'num_rooms', type: 'INTEGER DEFAULT 1' },
        { name: 'advance_deposit', type: 'REAL DEFAULT 0' },
        { name: 'arrival_time', type: 'TEXT' },
        { name: 'checkout_time', type: 'TEXT' }
    ];

    for (const col of columns) {
        try {
            await new Promise((resolve, reject) => {
                db.run(`ALTER TABLE bookings ADD COLUMN ${col.name} ${col.type}`, (err) => {
                    if (err) {
                        if (err.message.includes('duplicate column name')) {
                            console.log(`Column ${col.name} already exists.`);
                            resolve();
                        } else {
                            reject(err);
                        }
                    } else {
                        console.log(`Added column ${col.name}`);
                        resolve();
                    }
                });
            });
        } catch (err) {
            console.error(`Failed to add column ${col.name}:`, err.message);
        }
    }

    console.log('Migration completed.');
};

migrate();
