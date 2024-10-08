
class HandlerManager {
    constructor() {
        if(new.target === HandlerManager) {
            throw new Error("HandlerManager is abstract class");
        }
    }

    static getEntity(req, res) {
        throw new Error("Method 'getEntity()' must be implemented.");
    }

    static async getEntities(req, res, numOfEntities = 0){
        throw new Error("Method 'getEntities()' must be implemented.");
    }

    static createEntity(req, res) {
        throw new Error("Method 'createEntity()' must be implemented.");
    }

    static deleteEntity(req, res) {
        throw new Error("Method 'deleteEntity()' must be implemented.");
    }

    static updateEntity(req, res) {
        throw new Error("Method 'updateEntity()' must be implemented.");
    }
}

module.exports = HandlerManager;