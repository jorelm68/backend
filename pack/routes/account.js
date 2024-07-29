const express = require('express')
const router = express.Router();
const {
    autothenticate,
    checkCredentials,
    signIn,
    signUp,

    deleteAccount,
    changePassword,
} = require('../controllers/accountController');

router.post('/autothenticate', autothenticate);
router.post('/checkCredentials', checkCredentials);
router.post('/signIn', signIn);
router.post('/signUp', signUp);

router.post('/deleteAccount', deleteAccount);
router.post('/changePassword', changePassword);

module.exports = router;