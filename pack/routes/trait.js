const express = require('express');
const router = express.Router();
const {
    createTrait,
    findTrait,
    deleteTrait,
    searchTraits,
} = require('../controllers/traitController');

router.post('/createTrait', createTrait);
router.post('/findTrait', findTrait);
router.post('/deleteTrait', deleteTrait);
router.post('/searchTraits', searchTraits);

module.exports = router;