const express = require('express');
const router = express.Router();

const { 
    createPost,
    deletePost,
    searchPosts,
} = require('../controllers/postController');

router.post('/createPost', createPost);
router.post('/deletePost', deletePost);
router.post('/searchPosts', searchPosts);

module.exports = router;