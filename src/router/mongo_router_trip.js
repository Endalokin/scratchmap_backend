import express from "express";
import { tripController } from '../controller/mongo_controller_trip.js'
import getTracks from "../connections/trips/getTracksFromDb.js";

const router = express.Router();
/* 
router.get("/tracks", async (req, res) => {
  res.json(await getTracks())
}); */
router.get('/', tripController.getTrips)
/* router.post('/:id', tripController.updateFootprintTable) */

export default router;
