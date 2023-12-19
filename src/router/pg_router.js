import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.send("Don't know what I'll need yet")
})

export default router;