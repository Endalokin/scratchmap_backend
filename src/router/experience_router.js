import express from 'express'
import { experienceController } from '../controller/experience_controller.js'

const router = express.Router()

router.get('/', experienceController.getExperiences)

router.post('/images/colour', experienceController.postColour)

export default router;