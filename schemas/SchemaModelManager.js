
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

module.exports = SchemaModelManager;