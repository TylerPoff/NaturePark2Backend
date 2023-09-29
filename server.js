import server from 'express';
import cors from 'cors';
import router from './api/parks.route.js';

const app = express(); // Used to define routes and handle incoming requests

app.use(cors()); // Set up cors middleware. Handles requests from web browsers
app.use(express.json()); // Parse incoming JSON. Request body available through req.body

app.use('/api', router); // Any routes starting with /api will be handled via router
app.use('*', (req, res) => {
    res.status(404).json({error: 'not found'}); // If request doesn't match route, respond with 404
});

export default app;