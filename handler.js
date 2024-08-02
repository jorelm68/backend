const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const AWS = require('aws-sdk')
const sharp = require('sharp')
const bucketName = process.env.BUCKET_NAME
const s3 = new AWS.S3({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
})

const Account = require('./pack/models/Account');
const Chat = require('./pack/models/Chat');
const Code = require('./pack/models/Code')
const Event = require('./pack/models/Event');
const Group = require('./pack/models/Group');
const Meet = require('./pack/models/Meet');
const Message = require('./pack/models/Message');
const Notification = require('./pack/models/Notification');
const Photo = require('./general/models/Photo');
const Place = require('./pack/models/Place');
const Student = require('./pack/models/Student');
const Trait = require('./pack/models/Trait');

const handleRequest = async (req, res, code) => {
    try {
        await code(req, res)
    } catch (error) {
        // Check if the status code has been set before
        if (!res.statusCode || res.statusCode === 200) {
            res.status(400);
        }
        res.json({ errorMessage: error.message, data: null })
        console.log(error);
    }
}
const handleResponse = async (res, data) => {
    return res.status(200).json(data)
}
const handleInputValidation = async (req, checks, validationResult) => {
    // Apply input validation and sanitization rules
    await Promise.all(checks.map((validation) => validation.run(req)))

    // Check for validation errors
    const errors = validationResult(req)
    let errorMessage = ''
    for (const error of errors.errors) {
        errorMessage += `${error.value} is not a valid ${error.path}, `
    }
    if (!errors.isEmpty()) {
        throw new Error(errorMessage);
    }
}

const handleS3Put = async (key, body) => {
    await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
    }).promise()
}
const handleS3Get = async (key) => {
    return await s3.getObject({
        Bucket: bucketName,
        Key: key
    }).promise()
}
const handleS3Delete = async (key) => {
    await s3.deleteObject({
        Bucket: bucketName,
        Key: key
    }).promise()
}

const handleResize = async (buffer, size) => {
    let imageSize = parseInt(size, 10) || 1080 // Default size is 1080 if not provided or invalid

    // Resize the image using sharp
    const resizedImageBuffer = await sharp(buffer)
        .resize(imageSize, imageSize) // Resize to the desired size
        .toBuffer()

    return resizedImageBuffer
}

const sendPushNotification = async (pushToken, body) => {
    const message = {
        to: pushToken,
        sound: 'default',
        title: 'Scrap',
        body: body,
        data: {
            icon: 'https://scrap-back-end-6a4f36f8f7ee.herokuapp.com/notificationIcon',
        },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

const handleMongoFilter = async (model, key, value) => {
    const Model = mongoose.model(model);

    await Model.updateMany(
        { [key]: { $in: [value] } },
        { $pull: { [key]: value } }
    )
}

const handleMongoGet = async (modelName, _id, key) => {
    const Model = mongoose.model(modelName);

    const model = await Model.findOne({ _id }, { [key]: 1 });

    if (!model) {
        throw new Error(`${model} not found in the database`);
    }
    if (!(key in model)) {
        throw new Error(`${model} does not contain ${key}`);
    }

    return model[key];
}

const handleIdentify = async (modelName, _id) => {
    const Model = mongoose.model(modelName);

    const model = await Model.findById(_id);
    if (!model) {
        throw new Error(`${modelName}: ${_id} not found in the database`);
    }

    return model;
}

const handleRelationship = async (student1, student2) => {
    const student1Model = await Student.findById(student1);
    const student2Model = await Student.findById(student2);

    if (!student1Model || !student2Model) {
        throw new Error(`Student not found in the database`);
    }

    if (student1 === student2) {
        return 'self';
    }
    if (student1Model.friends.includes(student2)) {
        return 'friend';
    }
    if (student1Model.incomingRequests.includes(student2)) {
        return 'incomingRequest';
    }
    if (student1Model.outgoingRequests.includes(student2)) {
        return 'outgoingRequest';
    }
    return 'none';
}

const handleEmail = async (email, subject, html) => {
    try {
        // Create a transporter using SMTP settings
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        })

        // Email content
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: html,
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error(`Error sending email: ${error}`)
            } else {
                return true
            }
        })
    } catch (error) {
        throw new Error(`Error sending email: ${error}`)
    }
}

const handlePhotos = async (req, numPhotos) => {
    for (let i = 0; i < numPhotos; ++i) {
        if (!req.files || !req.files[i] || !req.files[i].buffer) {
            throw new Error('Files were not properly delivered');
        }
    }

    let media = [];

    for (let i = 0; i < numPhotos; ++i) {
        // Process the image
        const _id = `Photo-${new mongoose.Types.ObjectId()}`;
        const path = `photo/${_id}.jpg`;
        const url = `${process.env.URL}/${_id}/${1080}`;
        const buffer = req.files[i].buffer;

        // Add the image to the AWS S3 bucket
        await handleS3Put(path, buffer);

        // Add the image to MongoDB
        const photoModel = new Photo({
            _id,
            path,
            url,
        });
        await photoModel.save();

        // Add the image to the media array
        media.push(photoModel._id);
    }

    // Return the media
    return media;
}

module.exports = {
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
}