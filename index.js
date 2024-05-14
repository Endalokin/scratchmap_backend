import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import experienceRouter from "./src/router/experience_router.js"
import tripRouter from "./src/router/trip_router.js"
import authRouter from "./src/router/auth_router.js"
import mongoRouter from "./src/router/mongo_router_example.js"
import mongoTripRouter from "./src/router/mongo_router_trip.js"
import fs from 'fs';
import { pool } from './src/utils/db.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const html = fs.readFileSync('index.html','utf8')
app.get('/',(req,res)=>res.type('html').send(html));

app.get("/test", (req, res) => {
    res.json({msg: `This is a test you got from the server. Hello ${process.env.SECRET_TEST}!`})
})

app.use("/user", authRouter)
app.use("/experiences", experienceRouter)
app.use("/old/trips", tripRouter)
app.use("/trips", mongoTripRouter)
app.use("/mongoTest", mongoRouter)

app.listen(8080, () => console.log("listening on 8080"))