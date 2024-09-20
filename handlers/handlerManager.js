
class HandlerManager {
    constructor() {
        if(new.target === HandlerManager) {
            throw new Error("HandlerManager is abstract class");
        }
    }

    static getEntity(entityKey) {
        throw new Error("Method 'getEntity()' must be implemented.");
    }

    static createEntity(entityData) {
        throw new Error("Method 'createEntity()' must be implemented.");
    }

    static deleteEntity(entityKey) {
        throw new Error("Method 'deleteEntity()' must be implemented.");
    }

    static updateEntity(entityKey, entityData) {
        throw new Error("Method 'updateEntity()' must be implemented.");
    }
}

module.exports = HandlerManager;