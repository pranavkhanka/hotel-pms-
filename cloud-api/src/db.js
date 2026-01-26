require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hotel_pms_cloud',
});

// Helper for querying
const query = (text, params) => pool.query(text, params);

// Connection test
pool.on('connect', () => {
    console.log('Connected to the Cloud PostgreSQL database.');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query,
    pool
};
