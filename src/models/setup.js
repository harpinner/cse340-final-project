import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const setupDatabase = async () => {


    let hasData = false;
    try{
        const result = await db.query('SELECT COUNT(*) FROM vehicles');
        hasData = parseInt(result.rows[0].count) > 0;

    }
    catch (error) {
        console.error('Error checking database:', error);
        hasData = false;
    }

    if (hasData) {
        console.log('Database already has data. Skipping setup.');
        return;
    }



    try {
        const sqlFilePath = join(__dirname, 'sql', 'migration.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        await db.query(sql);
        console.log('Database setup completed successfully.');
    } catch (error) {
        console.error('Error setting up the database:', error);
    }
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};



export default setupDatabase;