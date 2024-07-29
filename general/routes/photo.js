const express = require('express')
const router = express.Router();
const {
    createPhoto,
    readPhoto,
    updatePhoto,
    deletePhoto,
} = require('../controllers/photoController');

router.post('/createPhoto', createPhoto);
router.post('/readPhoto', readPhoto);
router.post('/updatePhoto', updatePhoto);
router.post('/deletePhoto', deletePhoto);

module.exports = router;