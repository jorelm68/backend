require('dotenv').config();
const fs = require('fs');
const ejs = require('ejs');
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

const Account = require('../models/Account');
const Chat = require('../models/Chat');
const Code = require('../models/Code')
const Event = require('../models/Event');
const Group = require('../models/Group');
const Meet = require('../models/Meet');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Photo = require('../../general/models/Photo');
const Place = require('../models/Place');
const Student = require('../models/Student');
const Trait = require('../models/Trait');

const createTrait = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('name').exists().withMessage('body: name is required'),
            body('description').exists().withMessage('body: description is required'),
        ], validationResult);

        let { name, description, photo } = req.body;

        // If the image isn't sent over as an id,
        // that means it's a base64 image
        if (!photo) {
            const photos = await handlePhotos(req, 1);
            photo = photos[0];
        }

        // Create the trait
        const traitModel = new Trait({
            name,
            photo,
            description,
            globalPopulation: 0,
        });
        await traitModel.save();

        // Return the trait
        return handleResponse(res, traitModel);
    }
    return handleRequest(req, res, code);
}

const findTrait = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('name').exists().withMessage('body: name is required'),
        ], validationResult);
        
        const { name } = req.body;

        // Find the trait
        const traitModel = await Trait.findOne({ name });

        if (!traitModel) {
            throw new Error('Trait not found');
        }
        
        return handleResponse(res, traitModel);
    }
    return handleRequest(req, res, code);
}

const deleteTrait = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('trait').exists().withMessage('body: trait is required'),
        ], validationResult);

        const { trait } = req.body;
        const traitModel = await handleIdentify('Trait', trait);

        const photoModel = await handleIdentify('Photo', traitModel.photo);

        // Delete the photo
        await handleS3Delete(photoModel.path);
        await photoModel.deleteOne();

        // Delete the trait
        await traitModel.deleteOne();

        return handleResponse(res, 'Trait deleted');
    }
    return handleRequest(req, res, code);
}

const searchTraits = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('search').exists().withMessage('body: search is required'),
        ], validationResult);
        
        const { search } = req.body;

        // Find the traits
        const traitModels = await Trait.find({ name: { $regex: search, $options: 'i' } });

        // Return their ids
        return handleResponse(res, traitModels.map(traitModel => traitModel._id));
    }
    return handleRequest(req, res, code);
}

module.exports = {
    createTrait,
    findTrait,
    deleteTrait,
    searchTraits,
}