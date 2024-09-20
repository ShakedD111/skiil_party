const UsersSchemaModel = require('../schemas/usersSchemaModels');
const usersSchema = UsersSchemaModel.getModel();
const ConnectionsSchemaModel = require('../schemas/ConnectionsSchemaModel');
HandlerManager = require('./handlerManager');


//////const connectionModel = ConnectionsSchemaModel.getModel();
const roles = require('../roles');

class UserHandler extends HandlerManager {
    constructor() {
        super();
    }

    static async getEntity(req, res) {
        try {
            //**to do**
            //check if can access user info using token
            console.log(req.params.userName);

            const user = await UsersSchemaModel.getModel().aggregate([
                { $match: { userName: req.params.userName } },
                { $project: {
                    userName: 1,
                    mail: 1,
                    tournaments: 1,
                    parties: 1,
                    connections: {
                        $map: {
                            input: { $objectToArray: "$connections" },
                            as: "conn",
                            in: {
                                k: "$$conn.k",
                                v: {
                                    appUserName: "$$conn.v.appUserName"
                                    // Exclude `appPassword`
                                }
                            }
                        }
                    }
                }}
            ]);
        
            if (!user || user.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
        
            res.status(200).json(user[0]); 
        } catch (error) {
             res.status(500).json({message : 'Internal server error'});
        }
    }

    static createEntity(entityData) {
        
    }

    static deleteEntity(entityKey) {
        
    }

    static updateEntity(entityKey, entityData) {
       
    }
}

module.exports = UserHandler;