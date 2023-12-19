import express from 'express'
import { contentfulController } from '../controller/contentful_controller.js'

const router = express.Router()

router.get('/trips', contentfulController.getTrips)

router.get('/trips/:id', (req, res) => {
    res.send("Should get travel object by id")
})

router.get('/experiences', contentfulController.getExperiences)

router.get('/experiences/:id', (req, res) => {
    res.send("Should get image object by id")
})

router.get('/images', contentfulController.getImages)

export default router;