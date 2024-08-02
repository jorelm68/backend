const express = require('express')
const router = express.Router();
const {
    createPhoto,
    readPhoto,
    updatePhoto,
    deletePhoto,
    initials,
} = require('../controllers/photoController');

router.post('/createPhoto', createPhoto);
router.post('/readPhoto', readPhoto);
router.post('/updatePhoto', updatePhoto);
router.post('/deletePhoto', deletePhoto);
router.get('/initials', initials);

module.exports = router;