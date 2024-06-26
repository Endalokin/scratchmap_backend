import express from 'express'
import { tripController } from '../controller/trip_controller.js'

const router = express.Router()

router.get('/', tripController.getTrips)
router.post('/:id', tripController.updateFootprintTable)
router.get('/calculateNext', tripController.calculateNext)
router.put('/updateCompensation/:id', tripController.updateCompensation)
router.post('/addTrack/:id', tripController.addTrack)
router.delete('/deleteTrack/:trackid', tripController.deleteTrack)


export default router;