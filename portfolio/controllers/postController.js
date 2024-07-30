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
    handlePhotos,
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
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);

        let { rawData } = req.body;
        const data = JSON.parse(rawData);

        const {
            name,
            description,
            selectors,
            captions,
            essay,
            link,
            color,
            backgroundColor,
            start,
            end,
            location,
            numPhotos,
        } = data;

        // Process any images
        console.log('body,', req.body, 'files,', req.files);
        const photos = await handlePhotos(req, numPhotos);

        console.log('photos,', photos);

        // Create the post
        const postModel = new Post({
            name,
            description,
            selectors,
            media: photos,
            captions,
            essay,
            link,
            color,
            backgroundColor,
            start,
            end,
            location,
        });
        await postModel.save();

        const updatedLink = link.replace(/<POST>/g, postModel._id);
        postModel.link = updatedLink;
        await postModel.save();

        // Return the post
        return handleResponse(res, postModel);
    }
    return handleRequest(req, res, code);
}

const updatePost = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('_id').exists().withMessage('body: _id is required'),
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);
        
        const { _id, rawData } = req.body;
        const data = JSON.parse(rawData);

        const postModel = await handleIdentify('Post', _id);

        const {
            name,
            description,
            selectors,
            captions,
            media,
            essay,
            link,
            color,
            backgroundColor,
            start,
            end,
            location,
            numPhotos,
        } = data;

        // Process any images
        const photos = await handlePhotos(req, numPhotos);

        // combine the new and old media together
        let newMedia = [];
        for (const medium of media) {
            if (medium === 'placeholder') {
                newMedia.push(photos.shift());
            }
            else {
                newMedia.push(medium);
            }
        }
        
        // Update the post
        postModel.name = name;
        postModel.description = description;
        postModel.selectors = selectors;
        postModel.media = newMedia;
        postModel.captions = captions;
        postModel.essay = essay;
        postModel.link = link;
        postModel.color = color;
        postModel.backgroundColor = backgroundColor;
        postModel.start = start;
        postModel.end = end;
        postModel.location = location;
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

        const postModel = await handleIdentify('Post', _id);
        for (const photo of postModel.media) {
            const photoModel = await handleIdentify('Photo', photo);
            await handleS3Delete(photoModel.path);
            await photoModel.delete();
        }

        // Delete the post
        await postModel.delete();

        // Return a success message
        return handleResponse(res, 'Post deleted successfully');
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
                { selectors: { $regex: query, $options: 'i' } },
            ]
        });

        // Return the post ids
        return handleResponse(res, postModels.map(post => post._id));
    }
    return handleRequest(req, res, code);
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    searchPosts,
}