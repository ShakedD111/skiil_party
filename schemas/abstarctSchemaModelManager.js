const mongoose = require('mongoose');

class SchemaModelManager {
    static _schema = null;
    static _model = null;

    constructor() {
        if( new.target === SchemaModelManager){
            throw new Error('SchemaModelManager is abstract class');
        }
    }

    static getSchema() {
        throw new Error("Method 'getSchema()' must be implemented.");
    }

    static getModel() {
        throw new Error("Method 'getModel()' must be implemented.");
    }
}


class ConnectionsSchemaModel extends SchemaModelManager {
    constructor() {
        super();
    }

    static getSchema() {
        if(!this._schema) {
            this._schema = new mongoose.Schema({
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
        }

        return this._schema;
    }


    static getModel(){
        if(!this._model){
            this._model = mongoose.model('Connection', this.getSchema());
        }
        return this._model;
    }
}

class UsersSchemaModel extends SchemaModelManager{
    constructor(){
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


module.exports = {UsersSchemaModel, ConnectionsSchemaModel};