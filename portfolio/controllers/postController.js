require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');
const {
    handleInputValidation,
    handleRequest,
    handleResponse,
    handleResize,
    handleS3Get,
    handleS3Put,
    handleS3Delete,
    sendPushNotification,
    handleMongoFilter,
    handleMongoGet,
    handleIdentify,
    handleRelationship,
    handleEmail,
    handlePhoto,
} = require('../../handler');
const {
    body,
    param,
    validationResult
} = require('express-validator')

const Account = require('../../pack/models/Account');
const Chat = require('../../pack/models/Chat');
const Code = require('../../pack/models/Code')
const Event = require('../../pack/models/Event');
const Group = require('../../pack/models/Group');
const Meet = require('../../pack/models/Meet');
const Message = require('../../pack/models/Message');
const Notification = require('../../pack/models/Notification');
const Photo = require('../../general/models/Photo');
const Place = require('../../pack/models/Place');
const Student = require('../../pack/models/Student');
const Trait = require('../../pack/models/Trait');

const Post = require('../models/Post');


const createPost = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('name').exists().withMessage('body: name is required'),
            body('description').exists().withMessage('body: description is required'),
            body('link').exists().withMessage('body: link is required'),
        ], validationResult);

        let {
            name,
            description,
            photo,
            link,
            maxWidth,
            minWidth,
            minHeight,
            maxHeight,
            photoWidth,
            photoHeight,
            color,
            backgroundColor,
            flexDirection,
            createdAt,
        } = req.body;

        // Process any images
        if (!photo) {
            const photoModel = await handlePhoto(req);
            photo = photoModel._id;
        }

        // Create the post
        const postModel = new Post({
            name,
            description,
            link,
            photo,

            maxWidth: maxWidth || '100%',
            minWidth: minWidth || 200,
            minHeight: minHeight || 200,
            maxHeight: maxHeight || '100%',
            photoWidth: photoWidth || 200,
            photoHeight: photoHeight || 200,
            color: color || 'black',
            backgroundColor: backgroundColor || 'white',
            flexDirection: flexDirection || 'column',

            createdAt: createdAt || new Date(),
        });
        await postModel.save();

        // Return the post
        return handleResponse(res, postModel);
    }
    return handleRequest(req, res, code);
}

const deletePost = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('_id').exists().withMessage('body: _id is required'),
        ], validationResult);

        const { _id } = req.body;

        // Delete the post
        const postModel = await handleIdentify('Post', _id);
        await postModel.delete();

        // Return the post
        return handleResponse(res, postModel);
    }
    return handleRequest(req, res, code);
}

const searchPosts = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('query').exists().withMessage('body: query is required'),
        ], validationResult);

        const { query } = req.body;

        if (!query) {
            const postModels = await Post.find();
            return handleResponse(res, postModels.map(post => post._id));
        }

        // Search for posts
        const postModels = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { body: { $regex: query, $options: 'i' } },
            ]
        });

        // Return the post ids
        return handleResponse(res, postModels.map(post => post._id));
    }
    return handleRequest(req, res, code);
}

module.exports = {
    createPost,
    deletePost,
    searchPosts,
}