'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const images = require('./routes/images')

const port = process.env.PORT || 3000;

const app = express();

const http = require('http');
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/images', images);

app.use((req, res, next) => {
    next(createError(404));
})

server.listen(port, () => {

})