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

const createPhoto = async (req, res) => {
    const code = async (req, res) => {
        // Process the files
        const photos = await handlePhotos(req, 1);

        // Return the image id
        return handleResponse(res, photos[0]);
    }
    return handleRequest(req, res, code);
}

const readPhoto = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            param('photo').exists().withMessage('param: photo is required'),
            param('resolution').exists().withMessage('param: resolution is required'),
        ], validationResult);

        const { photo, resolution } = req.params;

        const photoModel = await handleIdentify('Photo', photo);

        // Get the image buffer from AWS S3
        const { Body } = await handleS3Get(photoModel.path);
        const buffer = await handleResize(Body, parseInt(resolution));

        // Return the image buffer in the response
        res.setHeader('Content-Type', 'image/jpeg');
        return res.status(200).send(buffer);
    }
    await handleRequest(req, res, code);
}

const updatePhoto = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('photo').exists().withMessage('body: photo is required'),
        ], validationResult);

        if (!req.files || !req.files[0] || !req.files[0].buffer) {
            throw new Error('No file in request');
        }

        const { photo } = req.body;
        const photoModel = await handleIdentify('Photo', photo);

        // Remove the old image from S3
        await handleS3Delete(photoModel.path);

        // Process the files
        const buffer = req.files[0].buffer;

        // Add the new image to S3
        await handleS3Put(photoModel.path, buffer);

        // Return success message
        return handleResponse(res, 'Photo updated');
    }
    return handleRequest(req, res, code);
}

const deletePhoto = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('photo').exists().withMessage('body: photo is required'),
        ], validationResult);

        const { photo } = req.body;

        const photoModel = await handleIdentify('Photo', photo);

        // Remove the image from S3
        await handleS3Delete(photoModel.path);

        // Remove the image from MongoDB
        await photoModel.deletOne();

        // Return a success message
        return handleResponse(res, 'Photo deleted');
    }
    return handleRequest(req, res, code);
}

const initials = async (req, res) => {
    const buffer = fs.readFileSync('assets/photos/initials.png')
    res.setHeader('Content-Type', 'image/png')
    res.send(buffer)
}

module.exports = {
    createPhoto,
    readPhoto,
    updatePhoto,
    deletePhoto,
    initials,
}