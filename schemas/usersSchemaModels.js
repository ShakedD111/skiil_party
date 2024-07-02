const mongoose = require('mongoose');

//sub Schema 
const connectionsSchema = new mongoose.Schema({
    /*appName: {
        type: String,
        required: true
    },*/
    appUserName: {
        type: String,
        required: true
    },
    appPassword: {
        type: String,
        required: true
    }
});

/*const tournamentsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    place: {
        type: Number,
        required: false
    }
});*/


//user schema 
//the connections is a map and the keys will be the app name 
//thr tournaments is an array of string, each string will save the tournament id(the tournament have a map with the user as the key and info as value)
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
    role: {
        type: Number,
        required: true
    },
    connections: {
        /*type: [connectionsSchema],
        default: []*/
        type: Map,
        of: connectionsSchema,
        default: {}
    },
    tournaments: {
        /*type: tournamentsSchema,*/
        type: [String],
        default: []
    },
    parties: {
        type: [String],
        default: []
    }
    
});


const users = mongoose.model('Users', usersSchema);
//const tournaments = mongoose.model('Tournaments', tournamentsSchema);
//const connections = mongoose.model('Connections', connectionSchema);

//module.exports = {users, tournaments, connections};
module.exports = users;