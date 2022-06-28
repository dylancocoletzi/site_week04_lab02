const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { PORT } = require("./config")

const { NotFoundError } = require("./utils/errors")

const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan("tiny"))

app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message

    return res.status(status).json({
        error : {message, status},
    })
})



app.listen(PORT, () => {
    console.log(`🚀 Server running http://localhost:${PORT}`)
})