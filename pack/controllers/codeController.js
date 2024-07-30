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

const createCode = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('email').exists().withMessage('body: email is required'),
        ], validationResult);

        const { email } = req.body;

        const codeModel = await Code.findOne({ email });
        if (codeModel) {
            if (codeModel) {
                if (codeModel.expiration > new Date()) {
                    let minutes = Math.floor((codeModel.expiration - new Date()) / 60000);
                    if (minutes < 1) {
                        minutes = 1;
                    }
                    res.status(900);
                    throw new Error(`We already sent you a code! Try checking your spam folder. You can request a new code in ${minutes} minute${minutes === 1 ? '' : 's'}.`);
                }
                else {
                    await codeModel.deleteOne();
                }
            }
        }

        // Create a new 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000);

        // Create the object
        const newCodeModel = new Code({
            email,
            code,
            expiration: new Date(new Date().getTime() + 5 * 60000)
        });
        await newCodeModel.save();

        // Send an email to the user with the code
        const templatePath = 'pack/views/emailCode.ejs';
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        const htmlContent = ejs.render(templateContent, { code });
        await handleEmail(email, 'Pack Code', htmlContent);

        return handleResponse(res, true);
    }
    return handleRequest(req, res, code);
}

const verifyCode = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('email').exists().withMessage('body: email is required'),
            body('code').exists().withMessage('body: code is required'),
        ], validationResult);

        const { email, code: codeString } = req.body;

        const code = parseInt(codeString);

        const codeModel = await Code.findOne({ email });
        if (!codeModel) {
            res.status(901);
            throw new Error('Looks like your code expired. Go ahead and request a new one!');
        }

        if (codeModel.expiration < new Date()) {
            res.status(901);
            throw new Error('Looks like your code expired. Go ahead and request a new one!');
        }

        if (codeModel.code !== code) {
            res.status(902);
            throw new Error('Invalid code. Please try again.');
        }

        // Delete the code object
        await codeModel.deleteOne();

        return handleResponse(res, true);
    }
    return handleRequest(req, res, code);
}

module.exports = {
    createCode,
    verifyCode,
}