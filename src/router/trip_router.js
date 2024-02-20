import express from 'express'
import { tripController } from '../controller/trip_controller.js'

const router = express.Router()

router.get('/', tripController.getTrips)
router.post('/:id', tripController.updateFootprintTable)
router.put('/updateCompensation/:id', tripController.updateCompensation)


export default router;