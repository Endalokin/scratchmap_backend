import express from 'express'
import { authController } from '../controller/mongo_auth_controller.js'

const router = express.Router()

// used for development purposes only so far
/* router.post('/signup', authController.signUp) */

router.post("/login", authController.login)

export default router;