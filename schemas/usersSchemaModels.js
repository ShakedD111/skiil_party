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
                parties: {
                    type: [String],
                    default: []
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