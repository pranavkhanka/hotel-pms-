const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../db/hotel.db');
const SCHEMA_PATH = path.join(__dirname, '../db/schema.sql');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the Local Hotel SQLite database.');
        db.run('PRAGMA foreign_keys = ON;');
    }
});

// Helper functions for Promise-based usage
const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.log('Error running sql ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
};

const get = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const initDb = async () => {
    try {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        // Split schema by semi-colon to run commands individually (sqlite3 doesn't typically run multi-statement scripts in one go via exec)
        // However, db.exec can do it if it's simple. Let's try db.exec or split.
        // For robustness, let's use db.exec which is intended for scripts.
        return new Promise((resolve, reject) => {
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Schema initialization failed:', err);
                    reject(err);
                } else {
                    console.log('Schema initialized successfully.');
                    resolve();
                }
            });
        });
    } catch (err) {
        console.error('Failed to read schema file:', err);
        throw err;
    }
};

module.exports = { db, run, get, all, initDb };
