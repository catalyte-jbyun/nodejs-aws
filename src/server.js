'use strict';

const express = require('express');

const images = require('./routes/images')

const port = process.env.PORT || 3000;

const app = express();

const http = require('http');
const server = http.createServer(app);

app.use('/images', images);

app.use((req, res, next) => {
    next(createError(404));
})

server.listen(port, () => {

})