import express from 'express'
import { experienceController } from '../controller/mongo_controller_experience.js'

const router = express.Router()

router.get('/', experienceController.getExperiences)
router.post('/images/update', experienceController.updateImgData)

export default router;