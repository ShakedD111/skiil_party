
class SchemaModelManager{
    constructor(){
        if( new.target === SchemaModelManager){
            throw new Error('SchemaModelManager is abstract class');
        }
    }

    getSchemaModel(){}
}