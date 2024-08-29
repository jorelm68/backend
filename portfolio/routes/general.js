const express = require('express')
const router = express.Router();
const {
    read,
    update,
    push,
    pull,
    exists,

    clean,
    factoryReset,
} = require('../controllers/generalController');

router.post('/read', read);
router.post('/update', update);
router.post('/push', push);
router.post('/pull', pull);
router.post('/exists', exists);

router.post('/clean', clean);
router.post('/factoryReset', factoryReset);

module.exports = router;