import express from 'express'
import { pool } from '../utils/db.js';

const router = express.Router()

router.get('/', (req, res) => {
    pool
    .query("select * from Colours")
    .then(data => {
        res.json(data.rows)
    })
    .catch(err => res.json({msg: "unable to display data", err}))
})

export default router;