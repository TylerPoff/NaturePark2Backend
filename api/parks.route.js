import express from 'express';
import ParksController from './parks.controller.js';
import MemsController from '.mems.controller.js';
import ActsController from '.acts.controller.js';

const router = express.Router();

export default router;

router.route('/parks').get(ParksController.apiGetParks);
router.route('/parks/:id').get(ParksController.apiGetParkByID);
router.route('/states').get(ParksController.apiGetStates);