const express = require('express');
const router = express.Router();

const { 
    createPost,
    updatePost,
    deletePost,
    searchPosts,
} = require('../controllers/postController');

router.post('/createPost', createPost);
router.post('/updatePost', updatePost);
router.post('/deletePost', deletePost);
router.post('/searchPosts', searchPosts);

module.exports = router;