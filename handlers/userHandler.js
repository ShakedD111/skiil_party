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

            const user = await usersSchema.aggregate([
                { $match: { userName: req.params.userName } },
                { $project: {
                    userName: 1,
                    mail: 1,
                    tournaments: 1,
                    parties: 1,
                    crowns: 1,
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

    static async getEntities(req, res, numOfEntities = 0){
        try {
            
        } catch(error) {
            req.status(500).json({massage: "Internal Server Error"});
        }
    }

    static async createEntity(req, res) {
        try {
            //{userName, password, mail}
            const entityData  = req.body;

            // Check if all required fields are provided
            if(!entityData.userName || !entityData.password || !entityData.mail) {
                res.status(409).json({'message' : `you forgot something`});
                return;
            }

            //need to do - check valid data

            //check if a userName or mail is already taken
            const taken = await usersSchema.findOne({
                $or: [
                    {userName: entityData.userName},
                    {mail: entityData.mail}
                ]
            });

            if(taken){
                res.status(409).json({'message' : `you can not take a different user details`});
                return;
            }

            // creating a schema with the new user details and adding him to the DB
            // In the creating of a new user, the connections, tournaments and parties should be empty
            //create the connection map:
            

            const connectionsMap = new Map();

            ConnectionsSchemaModel._connectionsList.forEach((value, index, array) => {
                connectionsMap.set(value, null);
            });

            const newUser = new usersSchema({
                userName: entityData.userName,
                password: entityData.password,
                mail: entityData.mail,
                role: roles.basic,
                connections: connectionsMap,
                tournaments: [],
                parties: [],
                crowns: 0
            });
            
            try {
                await newUser.save();
                res.status(201).json("saved successfully");
            } catch(error) {
                console.error('Error saving user:', error);
                res.status(500).json({ 'message': 'Error saving user' });
            }

        } catch (error) {
            res.status(500).json({message : 'Internal server error'});
        }
    }

    static async deleteEntity(req, res) {
        try {
            const {userName} = req.body;
            const action = await usersSchema.deleteOne({"userName": userName});
            if(action.deletedCount > 0) {
                res.status(200).json({'message': 'user was deleted'});
            } else{
                res.status(404).json({'message': 'user was not found'});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message : 'Internal server error'});

        }
    }

    static async updateEntity(req, res) {
        try {
            const {oldUserName, updateData} = req.body;

            if (!oldUserName || !updateData || typeof updateData !== 'object') {
                return res.status(400).json({ message: 'Invalid input' });
            }

            

            const activeUserName = "rmbo1";
            const activeUser = await usersSchema.findOne({userName: activeUserName});
            const oldUser = await usersSchema.findOne({userName: oldUserName});

            //check if user exists
            if(!oldUser){
                res.status(409).json({'message' : `the user does not exists`});
                return;
            }

            //adding conditions to check if data already in use
            const conditions = [];
            if(updateData.userName) {
                conditions.push({userName: updateData.userName});
            } 
            if(updateData.mail) {
                conditions.push({mail: updateData.mail});
            }
            
            //check if new userName
            var taken;
            if(conditions.length > 0) {
                taken = await usersSchema.findOne({
                    $or: conditions
                }).exec();
            }

            if(taken){
                res.status(409).json({'message' : `you can not take a different user details`});
                return;
            }

            // need to check if the user can update the oldUser details 
            //need to check by the user that requested
            switch(activeUser.role) {
                case roles.admin:
                    if(activeUserName !== oldUserName && oldUser.role === roles.admin){
                        return res.status(400).json({ message: 'you can not do this!!' });
                    }
                    break;
                case roles.basic:
                    if(activeUserName !== oldUserName){
                        return res.status(400).json({ message: 'you can not do this!!' });
                    }
                    break;
                default:
                    return res.status(400).json({ message: 'what is that role???? R u a hacker?' });
            }

            //need to check if the updateData is valid and if the old data can be changed, for now only check if the userName/mail already taken
            const updateAct = await usersSchema.updateOne(
                {userName: oldUserName},
                {$set: updateData},
                {new: true, runValidators: true}
            ).then(updatedUser => {
                res.status(201).json(updatedUser);
            })
            .catch(error => {
                console.error('Error saving user:', error);
                res.status(500).json({ 'message': 'Error saving user' });
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message : 'Internal server error'});

        }
    }

    static async logIn(req, res) {
        try {
            const {name, password} = req.body;
            const exists = await usersSchema.findOne({
                $and: [
                    {password: password},
                    {$or: [
                        {userName: name},
                        {mail: name}
                        ]
                    }
                ]
            }).exec();

            if (exists) {
                res.status(200).json({message: "can login"});
            } else {
                res.status(404).json({message: "user does not exists"});
            }
        } catch(error) {
            res.status(500).json({message : 'Internal server error'});
        }
    }
}

module.exports = UserHandler;