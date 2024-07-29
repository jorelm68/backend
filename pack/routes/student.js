const express = require('express')
const router = express.Router();
const {
    acceptRequest,
    rejectRequest,
    cancelRequest,
    sendRequest,
    removeFriend,
} = require('../controllers/studentController');

router.post('/acceptRequest', acceptRequest);
router.post('/rejectRequest', rejectRequest);
router.post('/cancelRequest', cancelRequest);
router.post('/sendRequest', sendRequest);
router.post('/removeFriend', removeFriend);

module.exports = router;