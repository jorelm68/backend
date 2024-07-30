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

const autothenticate = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('student').exists().withMessage('body: student is required'),
            body('autoToken').exists().withMessage('body: autoToken is required'),
        ], validationResult)

        const { student, autoToken } = req.body;

        const studentModel = await handleIdentify('Student', student);
        const accountModel = await handleIdentify('Account', studentModel.account)
        
        if (autoToken === accountModel.autoToken) {
            return handleResponse(res, true);
        }

        return handleResponse(res, false);
    }
    return handleRequest(req, res, code);
}

const checkCredentials = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('student').exists().withMessage('body: student is required'),
            body('password').exists().withMessage('body: password is required'),
        ], validationResult);

        const { student, password } = req.body;

        const studentModel = await handleIdentify('Student', student);
        const accountModel = await handleIdentify('Account', studentModel.account);

        // Perform password verification
        const isMatch = await accountModel.comparePassword(password);
        if (isMatch) {
            return handleResponse(res, true);
        }
        else {
            throw new Error('Invalid credentials');
        }
    }
    return handleRequest(req, res, code);
}

const signIn = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('value').exists().withMessage('body: value is required'),
            body('password').exists().withMessage('body: password is required'),
        ], validationResult);

        const { value, password } = req.body;

        // Find the author in the database by email or username
        const accountModel = await Account.findOne({
            $or: [
                { email: value },
                { username: value }
            ]
        });

        if (!accountModel) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await accountModel.comparePassword(password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        
        const studentModel = await handleIdentify('Student', accountModel.student);

        return handleResponse(res, {
            student: studentModel,
            autoToken: authorModel.autoToken,
        })
    }
    return handleRequest(req, res, code);
}

const signUp = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('username').exists().withMessage('body: username is required'),
            body('email').exists().withMessage('body: email is required'),
            body('password').exists().withMessage('body: password is required'),
        ], validationResult);

        const {
            username,
            email,
            password,
        } = req.body;
    
        // Check if the username is already taken
        const existingUsername = await Profile.findOne({ username });
        if (existingUsername) {
            throw new Error('Username is already taken');
        }
    
        // Check if the email is already registered
        const existingEmail = await Profile.findOne({ email });
        if (existingEmail) {
            throw new Error('That email is already registered with another account')
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new author document in MongoDB
        const accountModel = new Account({
            email,
            password: hashedPassword,
            autoToken: mongoose.Types.ObjectId(),
        })
        await accountModel.save();

        // Create a new student document in MongoDB
        const studentModel = new Student({
            username,
            account: accountModel._id,
        })
        await studentModel.save();

        return handleResponse(res, {
            student: studentModel,
            autoToken: accountModel.autoToken,
        });
    }
    return handleRequest(req, res, code);
}

const changePassword = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('student').exists().withMessage('body: student is required'),
            body('oldPassword').exists().withMessage('body: oldPassword is required'),
            body('newPassword').exists().withMessage('body: newPassword is required'),
        ], validationResult);

        const { student, oldPassword, newPassword } = req.body;

        const studentModel = await handleIdentify('Student', student);
        const accountModel = await handleIdentify('Account', studentModel.account);

        // Perform password verification
        const isMatch = await accountModel.comparePassword(oldPassword);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        accountModel.password = hashedPassword;
        accountModel.autoToken = mongoose.Types.ObjectId();
        await accountModel.save();

        return handleResponse(res, true);
    }
    return handleRequest(req, res, code);
}

const deleteAccount = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { student } = req.body;

        const studentModel = await handleIdentify('Student', student);
        const accountModel = await handleIdentify('Account', studentModel.account);

        throw new Error('Delete account not implemented yet');
    }
    return handleRequest(req, res, code);
}

module.exports = {
    autothenticate,
    checkCredentials,
    signIn,
    signUp,

    deleteAccount,
    changePassword,
}