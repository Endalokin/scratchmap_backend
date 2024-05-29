import express from "express";
import { tripController } from '../controller/mongo_controller_trip.js'

const router = express.Router();

router.get('/', tripController.getTrips)
router.post('/:id', tripController.updateFootprintTable)
router.put('/updateCompensation/:id', tripController.updateCompensation)
router.post('/addTrack/:id', tripController.addTrack)
router.delete('/deleteTrack/:trackid', tripController.deleteTrack)
router.get('/calculateNext', tripController.calculateNext)

export default router;
