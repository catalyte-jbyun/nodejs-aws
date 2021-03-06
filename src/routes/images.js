const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const env = require('../config/s3.env.js');

const stream = require('stream');

const s3 = new aws.S3({
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.REGION,
});

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/octet-stream' || file.mimetype === 'video/mp4'
            || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    storage: multerS3({
        acl: 'public-read',
        shouldTransform: (req, file, cb) => {
            cb(null, /^image/i.test(file.mimetype))
        },
        key: (req, file, cb) => {
            var filename = file.originalname.replace(path.extname(file.originalname), '@') + Date.now() + path.extname(file.originalname);
            file.originalname = filename;
            cb(null, filename);
        },
        s3,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        bucket: 'aa-images-s3',
        key: (req, file, cb) => {
            req.file = Date.now() + file.originalname;
            cb(null, req.file);
        },
        transforms: [{
            id: 'original',
            key: (req, file, cb) => {
                console.log('test0-1', file);
                // cb(null, file.originalname);
                cb(null, 'original-' + file.originalname);
            },
            transform: (req, file, cb) => {
                cb(null, new stream.PassThrough())
            }
        }, {
            id: 'thumbnail',
            key: (req, file, cb) => {
                console.log('test0-2', file);
                // cb(null, 'thumb-' + file.originalname)
                cb(null, 'thumbnail-' + file.originalname);
            },
            transform: (req, file, cb) => {
                cb(null, sharp().resize({ width: 200, height: 200, fit: sharp.fit.cover }).png({quality: 80}))
            }
        }]
    })
});

router.post('/single', upload.single('file'), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('test0', req.files);
})

router.post('/multiple', upload.array('files'), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('test1', req.body);
    console.log('test1-2', req.files);
})

module.exports = router;