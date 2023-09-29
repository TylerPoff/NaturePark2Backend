import mongodb from 'mongodb';
import dotenv from 'dotenv';
import app from './server.js';
import ParksDAO from './dao/parksDAO.js';
import MemsDAO from './dao/memsDAO.js';
import ActsDAO from './dao/actsDAO.js';

async function main() { // Entry point for application
    dotenv.config(); // Load environment variables from .env

    const client = new mongodb.MongoClient( // Create new MongoDB client
        process.env.PARKS_DB_URI // Set DB URI from .env
    );
    const port = process.env.PORT || 8000; // Set Port from .env

    try {
        await client.connect(); // Connect to DB 
        await ParksDAO.injectDB(client); // Inject DB client into Data Access Objects to connect to collections
        await MemsDAO.injectDB(client);
        await ActsDAO.injectDB(client);

        app.listen(port, () => { // Specify which port server should listen to
            console.log(`Server is running on port ${port}`);
        });
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);