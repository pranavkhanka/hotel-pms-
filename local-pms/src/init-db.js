const { initDb, db } = require('./db');

initDb()
    .then(() => {
        console.log('Database initialization CLI completed.');
        db.close();
    })
    .catch((err) => {
        console.error('Database initialization CLI failed:', err);
        process.exit(1);
    });
