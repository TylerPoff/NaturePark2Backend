import ParksDAO from "../dao/parksDAO";

// Handles data requests to Parks

export default class ParksController {
    
    // Request to retieve entire park list
    static async apiGetParks(req, res, next) {
        // Define parks on any given page and page number. Also defines default values
        const parksPerPage = req.query.parksPerPage ? parseInt(req.query.parksPerPage) : 16;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        // Defines filters for searching all parks
        // Allows for filtering based on US State and Name of park
        let filters = {};
        if(req.query.state) {
            filters.state = req.query.state;
        }
        else if(req.query.name) {
            filters.name = req.query.name;
        }

        // Return park list and number of parks based on given filters and requirements
        const {parksList, totalNumParks} = await ParksDAO.getParks({filters, page, parksPerPage});

            let response = {
                parks: parksList,
                page: page,
                filters: filters,
                entries_per_page: parksPerPage,
                total_results: totalNumParks,
            };
            
            res.json(response);
    }

    // Request to retrieve specific park
    static async apiGetParkById(req, res, next) {
        try {
            let id = req.params.id || {}; // Get id from URL path
            let park = await ParksDAO.getParkByID(id);
            if(!park) {
                res.status(404).json({error: "Park could not be found"});
                return;
            }
            res.json(park);
        } catch(e) {
            console.log(`Failed to handle request to get park by id: ${e}`);
            res.status(500).json({error: e});
        }

    }

    // Request to retrieve states that parks are located in
    static async apiGetStates(req, res, next) {
        try {
            let states = await ParksDAO.getStates();
            res.json(states);
        } catch(e) {
            console.log(`Failed to handle request to get states: ${e}`);
            res.status(500).json({error: e});
        }

    }
}