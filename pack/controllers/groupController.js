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

module.exports = {
    
}