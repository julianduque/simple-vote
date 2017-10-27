'use strict'

const http = require('http')
const path = require('path')
const express = require('express')

const port = process.env.PORT || 8888
const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => console.log(`Server listening on port ${port}`))
