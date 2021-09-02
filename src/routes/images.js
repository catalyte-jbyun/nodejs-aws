const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

const s3 = new aws.S3({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
});

router.post('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('test1');
})

module.exports = router;