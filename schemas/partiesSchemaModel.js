const { default: mongoose } = require("mongoose");
const SchemaModelManager = require("./SchemaModelManager");

class PartiesSchemaModel extends SchemaModelManager {
    //variables:
    //   _schema -> the schema of the parties 
    //   _model -> the model for use by mongoose's library 
    constructor() {
        
        super();
    }

    static getSchema() {
        if(!this._schema) {
            this._schema = new mongoose.Schema({
                partyName: {
                    type: String,
                    required: true
                }, 
                creationDate: {
                    type: Date,
                    required: true
                },
                description: {
                    type: String,
                    required: false
                },
                crownRequired: {
                    type: Number,
                    required: false
                }
            });
        }

        return this._schema
    }

    static getModel() {
        if(!this._model) {
            this._model = mongoose.model("Party", this.getSchema());
        }

        return this._model; 
    }
}

module.exports = PartiesSchemaModel;