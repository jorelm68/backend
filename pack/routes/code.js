const express = require('express')
const router = express.Router();
const {
   createCode,
   verifyCode,
} = require('../controllers/codeController');

router.post('/createCode', createCode);
router.post('/verifyCode', verifyCode);

module.exports = router;