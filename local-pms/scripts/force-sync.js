const { syncWorker } = require('../src/sync');
const { initDb } = require('../src/db');

(async () => {
    try {
        await initDb(); // Ensure local DB is ready
        console.log('Forcing manual sync...');
        await syncWorker();
        console.log('Manual sync done.');
    } catch (err) {
        console.error(err);
    }
})();
