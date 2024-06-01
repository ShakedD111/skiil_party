const mongoose = require('mongoose');

//sub Schema 
const connectionsSchema = new mongoose.Schema({
    appName: {
        type: String,
        required: true
    },
    appUserName: {
        type: String,
        required: true
    },
    appPassword: {
        type: String,
        required: true
    }
});

const tournamentsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    place: {type: Number}
});


//user schema 
const usersSchema = new mongoose.Schema({
    userName: { 
        type: String,
        required: true
        },
    mail: { 
        type: String,
        required: true
        },
    password: {
        type: String,
        required: true
        },
    connections: {
        type: [connectionsSchema],
        default: []
    },
    tournaments: {
        type: tournamentsSchema,
        default: []
    },
    parties: {
        type: [String],
        default: []
    }
    
});


module.exports = {usersSchema, tournamentsSchema, connectionsSchema};