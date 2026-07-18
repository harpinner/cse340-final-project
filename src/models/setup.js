import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repairSeedImageUrls = async () => {
    await db.query(`
        UPDATE vehicle_images
        SET image_url = CASE image_url
            WHEN '/images/vehicles/meridian-coupe-2011-1.jpg' THEN '/images/vehicles/meridian-coupe-2011.jpg'
            WHEN '/images/vehicles/meridian-coupe-2011-2.jpg' THEN '/images/vehicles/meridian-coupe-2011.jpg'
            WHEN '/images/vehicles/highline-sedan-2014-1.jpg' THEN '/images/vehicles/highline-sedan-2014.jpg'
            WHEN '/images/vehicles/vandale-wagon-2008-1.jpg' THEN '/images/vehicles/vandale-wagon-2008.jpg'
            WHEN '/images/vehicles/cresthill-suv-2016-1.jpg' THEN '/images/vehicles/cresthill-suv-2016.jpg'
        END
        WHERE image_url IN (
            '/images/vehicles/meridian-coupe-2011-1.jpg',
            '/images/vehicles/meridian-coupe-2011-2.jpg',
            '/images/vehicles/highline-sedan-2014-1.jpg',
            '/images/vehicles/vandale-wagon-2008-1.jpg',
            '/images/vehicles/cresthill-suv-2016-1.jpg'
        )
    `);
};

const repairMisplacedVehicleCategories = async () => {
    await db.query(`
        UPDATE vehicles AS vehicle
        SET category_id = category.id,
            description = NULL
        FROM categories AS category
        WHERE vehicle.category_id IS NULL
          AND vehicle.description = category.id::text
    `);
};

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
        await repairSeedImageUrls();
        await repairMisplacedVehicleCategories();
        console.log('Database already has data. Skipping setup.');
        return;
    }



    try {
        const sqlFilePath = join(__dirname, 'sql', 'migration.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');
        await db.query(sql);
        await repairSeedImageUrls();
        await repairMisplacedVehicleCategories();
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
