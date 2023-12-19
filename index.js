import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import contentfulRouter from "./src/router/contentful_router.js"
import pgRouter from "./src/router/pg_router.js"

const app = express()

app.use(cors())

app.get("/test", (req, res) => {
    res.json({msg: `This is a test you got from the server. Hello ${process.env.SECRET_TEST}!`})
})

app.use("/contentful", contentfulRouter)
app.use("/pg", pgRouter)

app.listen(8080, () => console.log("listening on 8080"))