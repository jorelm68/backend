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
    handleEmail,
    handlePhotos,
} = require('../../handler');
const {
    body,
    param,
    validationResult
} = require('express-validator')

const Photo = require('../models/Photo');
const Post = require('../models/Post');

const read = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('model').exists().withMessage('body: model is required'),
            body('_id').exists().withMessage('body: _id is required'),
        ], validationResult);

        const { model, _id } = req.body;

        // Find the document by the specified id
        const document = await handleIdentify(model, _id);

        // Return the entire document
        return handleResponse(res, document);
    }
    return handleRequest(req, res, code);
}

const update = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('model').exists().withMessage('body: model is required'),
            body('_id').exists().withMessage('body: _id is required'),
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);

        const { model, _id, rawData } = req.body;
        const data = JSON.parse(rawData);

        // Find the document by the specified id
        const document = await handleIdentify(model, _id);

        // Update the document with the specified keys and values
        for (const key in data) {
            if (data[key] === undefined) continue;
            document[key] = data[key];
        }
        await document.save();

        // Return the updated document
        return handleResponse(res, document);
    }
    return handleRequest(req, res, code);
}

const push = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('model').exists().withMessage('body: model is required'),
            body('_id').exists().withMessage('body: _id is required'),
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);

        const { model, _id, rawData } = req.body;
        const data = JSON.parse(rawData);

        // Find the document by the specified id
        const document = await handleIdentify(model, _id);

        // Push the values to the specified key
        for (const key in data) {
            for (const value of data[key]) {
                if (data[key] === undefined) continue;
                document[key].pull(value);
                document[key].push(value);
            }
        }
        await document.save();

        // Return the updated document
        return handleResponse(res, document);
    }
    return handleRequest(req, res, code);
}

const pull = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('model').exists().withMessage('body: model is required'),
            body('_id').exists().withMessage('body: _id is required'),
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);


        const { model, _id, rawData } = req.body;
        const data = JSON.parse(rawData);

        // Find the document by the specified id
        const document = await handleIdentify(model, _id);

        // Pull the values from the specified key
        for (const key in data) {
            for (const value of data[key]) {
                if (data[key] === undefined) continue;
                document[key].pull(value);
            }
        }
        await document.save();

        // Return the updated document
        return handleResponse(res, document);
    }
    return handleRequest(req, res, code);
}

const exists = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('model').exists().withMessage('body: model is required'),
            body('rawData').exists().withMessage('body: rawData is required'),
        ], validationResult);

        const { model, rawData } = req.body;
        const data = JSON.parse(rawData);

        let Model = null;
        if (['Account', 'Chat', 'Code', 'Event', 'Group', 'Meet', 'Message', 'Notification', 'Place', 'Student', 'Trait'].includes(model)) {
            Model = require(`../../pack/models/${model}`);
        }
        else if (['Post'].includes(model)) {
            Model = require(`../../portfolio/models/${model}`);
        }
        else if (['Photo'].includes(model)) {
            Model = require(`../models/${model}`);
        }
        const document = await Model.findOne(data);

        return handleResponse(res, { exists: !!document });
    }
    return handleRequest(req, res, code);
}

const clean = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('rawModels').exists().withMessage('body: rawModels is required'),
        ], validationResult);

        const { rawModels } = req.body;
        const models = JSON.parse(rawModels);

        for (const model of models) {
            let Model = null;
            if (['Account', 'Chat', 'Code', 'Event', 'Group', 'Meet', 'Message', 'Notification', 'Place', 'Student', 'Trait'].includes(model)) {
                Model = require(`../../pack/models/${model}`);
            }
            else if (['Post'].includes(model)) {
                Model = require(`../../portfolio/models/${model}`);
            }
            else if (['Photo'].includes(model)) {
                Model = require(`../models/${model}`);
                const photoModels = await Model.find({});
                for (const photoModel of photoModels) {
                    await handleS3Delete(photoModel.path);
                }
            }

            await Model.deleteMany({});
        }

        return handleResponse(res, true);
    }
    return handleRequest(req, res, code);
}

const factoryReset = async (req, res) => {
    const code = async (req, res) => {
        const photoModels = await Photo.find({});
        for (const photoModel of photoModels) {
            await handleS3Delete(photoModel.path);
        }

        for (const model of [Account, Chat, Code, Event, Group, Meet, Message, Notification, Photo, Place, Student, Trait]) {
            await model.deleteMany({});
        }

        return handleResponse(res, true);
    }
    return handleRequest(req, res, code);
}

module.exports = {
    read,
    update,
    push,
    pull,
    exists,

    clean,
    factoryReset,
};