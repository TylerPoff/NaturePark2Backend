import mongodb from 'mongodb';

// Queries DB directly for Parks data

const ObjectId = mongodb.ObjectId;
let parks;

export default class ParksDAO {
    
    // Connect to park collection in DB
    static async injectDB(conn) {
        if(parks) {
            return; // Prevent multiple initializations of the same collection
        }
        try {
            parks = await conn.db(
                process.env.PARKS_COLLECTION).collection('parks'); // Access parks collection in DB
                await parks.createIndex({name: 'text'}); // Used to enable text searching on the name field
        } catch(e) {
            console.error(`Unable to connect to ParksDAO: ${e}`);
        }
    }

    // Retrieve parks based on search parameters (if any)
    static async getParks({
        filters = null,
        page = 0,
        parksPerPage = 16,
    } = {}) {
        let query; // Used to define DB query
        if(filters) {
            if('name' in filters) {
                // Based on given text, search for text that matches parks name value
                query = {$text: {$search: filters['name']}};
            }
            else if('state' in filters) {
                // Based on given US state, find US state of parks that exactly equals given state
                query = {'state': {$eq: filters['state']}};
            }
        }

        let cursor; // Used to retrieve results of query
        try {
            // Apply query to filter results, limit results by parks per page, skip parks based on current page
            cursor = await parks.find(query).limit(parksPerPage).skip(parksPerPage * page);

            const parksList = await cursor.toArray(); // Converts found results to array
            const totalNumParks = await parks.countDocuments(query); // Counts number of items returned
            return {parksList, totalNumParks};
        } catch(e) {
            console.error(`Unable to get parks: ${e}`);
            return {parksList: [], totalNumParks: 0};
        }
    }

    // Retrieve a specific park, based on the parks ID
    static async getParkByID(id) {
        try {
            return await parks.aggregate([ // Query parks collection
                {
                    $match: {
                        _id: new ObjectId(id), // Match _id exactly to provided id
                    }
                }
            ]).next(); // Retrieve first document that matches criteria
        } catch(e) {
            console.error(`Unable to get park by ID: ${e}`);
            throw e;
        }
    }

    // Retrieve US states from DB
    static async getStates() {
        let states = [];
        try {
            states = await parks.distinct('state'); // Retrieve only distinct states from DB
            return states;
        } catch(e) {
            console.error(`Unable to get states: ${e}`);
            return states;
        }
    }
}