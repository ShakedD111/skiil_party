const SchemaModelManager = require('./SchemaModelManager');
const ConnectionsSchemaModel = require('./ConnectionsSchemaModel');
const mongoose = require('mongoose');

class UsersSchemaModel extends SchemaModelManager {
    constructor() {
        super();
    }

    static getSchema(){
        if(!this._schema){
            

            this._schema = new mongoose.Schema({
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
                    type: Map,
                    of: ConnectionsSchemaModel.getSchema(),
                    default: {}
                },
                tournaments: {
                    /*type: tournamentsSchema,*/
                    type: [String],
                    default: []
                },
                crowns: {
                    type: Number,
                    default: 0
                },
                parties: {
                    type: Map,
                    of: new mongoose.Schema({
                        role: { type: String, required: true },  // User's role in the party
                        joinDate: {type: Date, default: Date.now},  // User's join date 
                        score: {type: Number, required: true}    // User's score in the party, 
                        }),
                    default: {}
                },
                refreshToken: {
                    type: Object,
                    default: null
                }
            });
        }
        return this._schema;
    }


    static getModel(){
        if(!this._model){
            this._model = mongoose.model('User', this.getSchema());
        }
        return this._model;
    }
}

module.exports = UsersSchemaModel;