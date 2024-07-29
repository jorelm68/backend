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
    handlePhoto,
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

const acceptRequest = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('user').exists().withMessage('body: user is required'),
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { user, student } = req.body;

        const userModel = await handleIdentify('Student', user);
        const studentModel = await handleIdentify('Student', student);

        userModel.friends.pull(student);
        userModel.incomingRequests.pull(student);
        userModel.outgoingRequests.pull(student);
        studentModel.friends.pull(user);
        studentModel.incomingRequests.pull(user);
        studentModel.outgoingRequests.pull(user);

        userModel.friends.push(student);
        studentModel.friends.push(user);
        await userModel.save();
        await studentModel.save();

        return handleResponse(res, 'Request accepted');
    }
    return handleRequest(req, res, code);
}

const rejectRequest = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('user').exists().withMessage('body: user is required'),
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { user, student } = req.body;

        const userModel = await handleIdentify('Student', user);
        const studentModel = await handleIdentify('Student', student);

        userModel.friends.pull(student);
        userModel.incomingRequests.pull(student);
        userModel.outgoingRequests.pull(student);
        studentModel.friends.pull(user);
        studentModel.incomingRequests.pull(user);
        studentModel.outgoingRequests.pull(user);

        userModel.incomingRequests.pull(student);
        studentModel.outgoingRequests.pull(user);
        await userModel.save();
        await studentModel.save();

        return handleResponse(res, 'Request rejected');
    }
    return handleRequest(req, res, code);
}

const sendRequest = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('user').exists().withMessage('body: user is required'),
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { user, student } = req.body;

        const userModel = await handleIdentify('Student', user);
        const studentModel = await handleIdentify('Student', student);

        userModel.friends.pull(student);
        userModel.incomingRequests.pull(student);
        userModel.outgoingRequests.pull(student);
        studentModel.friends.pull(user);
        studentModel.incomingRequests.pull(user);
        studentModel.outgoingRequests.pull(user);

        userModel.outgoingRequests.push(student);
        studentModel.incomingRequests.push(user);
        await userModel.save();
        await studentModel.save();

        return handleResponse(res, 'Request sent');
    }
    return handleRequest(req, res, code);
}

const cancelRequest = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('user').exists().withMessage('body: user is required'),
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { user, student } = req.body;

        const userModel = await handleIdentify('Student', user);
        const studentModel = await handleIdentify('Student', student);

        userModel.friends.pull(student);
        userModel.incomingRequests.pull(student);
        userModel.outgoingRequests.pull(student);
        studentModel.friends.pull(user);
        studentModel.incomingRequests.pull(user);
        studentModel.outgoingRequests.pull(user);

        userModel.outgoingRequests.pull(student);
        studentModel.incomingRequests.pull(user);
        await userModel.save();
        await studentModel.save();

        return handleResponse(res, 'Request cancelled');
    }
    return handleRequest(req, res, code);
}

const removeFriend = async (req, res) => {
    const code = async (req, res) => {
        await handleInputValidation(req, [
            body('user').exists().withMessage('body: user is required'),
            body('student').exists().withMessage('body: student is required'),
        ], validationResult);
        
        const { user, student } = req.body;

        const userModel = await handleIdentify('Student', user);
        const studentModel = await handleIdentify('Student', student);

        userModel.friends.pull(student);
        userModel.incomingRequests.pull(student);
        userModel.outgoingRequests.pull(student);
        studentModel.friends.pull(user);
        studentModel.incomingRequests.pull(user);
        studentModel.outgoingRequests.pull(user);

        userModel.friends.pull(student);
        studentModel.friends.pull(user);
        await userModel.save();
        await studentModel.save();

        return handleResponse(res, 'Friend removed');
    }
    return handleRequest(req, res, code);
}

module.exports = {
    acceptRequest,
    rejectRequest,
    sendRequest,
    cancelRequest,
    removeFriend,
}