const fs = require('fs');
const path = require('path');
const { query, pool } = require('./db');

const migrate = async () => {
    try {
        console.log('[Migrate] Starting database migration...');

        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('[Migrate] Executing schema...');
        await query(schemaSql);

        console.log('[Migrate] Migration success! Database is ready.');
        process.exit(0);
    } catch (err) {
        console.error('[Migrate] Migration failed:', err);
        process.exit(1);
    }
};

migrate();
