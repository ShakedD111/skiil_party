SchemaModelManager = require('./SchemaModelManager');
const mongoose = require('mongoose');

class ConnectionsSchemaModel extends SchemaModelManager {
    static _connectionsList = ["discord", "youtube", "epic games"]; 
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


module.exports = ConnectionsSchemaModel;