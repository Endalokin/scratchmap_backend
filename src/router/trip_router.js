import express from 'express'
import { tripController } from '../controller/trip_controller.js'

const router = express.Router()

router.get('/', tripController.getTrips)
router.post('/:id', tripController.updateFootprintTable)


export default router;