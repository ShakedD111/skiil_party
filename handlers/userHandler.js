const UsersSchemaModel = require('../schemas/usersSchemaModels');
const usersSchema = UsersSchemaModel.getModel();
const ConnectionsSchemaModel = require('../schemas/ConnectionsSchemaModel');
const dbHandler = require('../config/userDbHandler');
HandlerManager = require('./handlerManager');
const mongoConnection = require('../config/mongoConnection');
//////const connectionModel = ConnectionsSchemaModel.getModel();
const roles = require('../roles');
const HttpStatus = require('../enums/httpStatus');

class UserHandler extends HandlerManager {
    constructor() {
        super();
    }

    static async getEntity(req, res) {
        await UserHandler.getEntitiesListByRang(res, {userName: req.params.userName}, 1);
    }

    static async getEntities(req, res){
        //to do: check valid info
        await UserHandler.getEntitiesListByRang(res, req.body, parseInt(req.query.limit));
    }

    static async getEntitiesListByRang(res, data = {}, limit = 0) {
        let aggregate;

        try {
            console.log(data);
            aggregate = await dbHandler.getEntityList(usersSchema, data, limit);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : 'Internal server error'});
        }
    
        if (!aggregate || aggregate.length === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: "could not find users" });
        }

        //numOfEntities = (numOfEntities === 0 ? usersSchema.length : numOfEntities);
        console.log(aggregate.length);
        res.status(HttpStatus.OK).json(aggregate);
    }

    static async createEntity(req, res) {
        try {
            //{userName, password, mail}
            const entityData  = req.body;

            // Check if all required fields are provided
            if(!entityData.userName || !entityData.password || !entityData.mail) {
                res.status(HttpStatus.BAD_REQUEST).json({'message' : `you forgot something`});
                return;
            }

            //need to do - check valid data

            //check if a userName or mail is already taken
            const taken = await dbHandler.isFieldsTaken(usersSchema, {
                userName: entityData.userName,
                mail: entityData.mail
            });

            if(taken.length){
                res.status(HttpStatus.CONFLICT).json({'message' : `you can not take a different user details`});
                return;
            }

            // creating a schema with the new user details and adding him to the DB
            // In the creating of a new user, the connections, tournaments and parties should be empty
            //create the connection map:
            

            const connectionsMap = UserHandler.createUserConnectionsMap(ConnectionsSchemaModel._connectionsList);
            
            UserHandler.createUserData(entityData, roles.basic, connectionsMap);

        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : 'Internal server error'});
        }
    }

    static async deleteEntity(req, res) {
        try {
            const {userName} = req.body;
            const action = await usersSchema.deleteOne({"userName": userName});
            if(action.deletedCount > 0) {
                res.status(HttpStatus.OK).json({'message': 'user was deleted'});
            } else{
                res.status(HttpStatus.NOT_FOUND).json({'message': 'user was not found'});
            }
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : 'Internal server error'});

        }
    }

    static async updateEntity(req, res) {
        try {
            const {oldUserName, updateData} = req.body;

            if (!oldUserName || !updateData || typeof updateData !== 'object') {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid input' });
            }

            const activeUserName = "rmbo1";
            const activeUser = await usersSchema.findOne({userName: activeUserName});
            const oldUser = await usersSchema.findOne({userName: oldUserName});

            //check if user exists
            if(!oldUser){
                res.status(HttpStatus.NOT_FOUND).json({'message' : `the user does not exists`});
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

            if(isFieldsTaken(usersSchema, {userName: updateData.userName, mail: updateData.mail}).length){
                res.status(HttpStatus.CONFLICT).json({'message' : `you can not take a different user details`});
                return;
            }

            // need to check if the user can update the oldUser details 
            //need to check by the user that requested
            switch(activeUser.role) {
                case roles.admin:
                    if(activeUserName !== oldUserName && oldUser.role === roles.admin){
                        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'you can not do this!!' });
                    }
                    break;
                case roles.basic:
                    if(activeUserName !== oldUserName){
                        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'you can not do this!!' });
                    }
                    break;
                default:
                    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'what is that role???? R u a hacker?' });
            }

            //need to check if the updateData is valid and if the old data can be changed, for now only check if the userName/mail already taken
            const updateAct = await usersSchema.updateOne(
                {userName: oldUserName},
                {$set: updateData},
                {new: true, runValidators: true}
            ).then(updatedUser => {
                res.status(HttpStatus.CREATED).json(updatedUser);
            })
            .catch(error => {
                console.error('Error saving user:', error);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 'message': 'Error saving user' });
            });
            
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : 'Internal server error'});
        }
    }

    static async logIn(req, res) {
        try {
            const {name, password} = req.body;
            const exists = await mongoConnection.aggregateHandler(usersSchema, [
                {
                    $match: {
                        $and: [
                            {password: password},
                            {$or: [
                                {userName: name},
                                {mail: name}
                                ]
                            }
                        ]
                    }
                }
            ]);
            /*const exists = await usersSchema.findOne({
                $and: [
                    {password: password},
                    {$or: [
                        {userName: name},
                        {mail: name}
                        ]
                    }
                ]
            }).exec();*/


            console.log(exists.length);
            if (exists.length) {
                res.status(HttpStatus.OK).json({message: "can login"});
            } else {
                res.status(HttpStatus.NOT_FOUND).json({message: "user does not exists"});
            }
        } catch(error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message : 'Internal server error'});
        }
    }

    static createUserConnectionsMap(set) {
        const connections = new Map();

        ConnectionsSchemaModel._connectionsList.forEach((value, index, array) => {
            connections.set(value, null);
        });

        return Object.fromEntries(connections);
    }

    static async createUserData(entityBaseData, role = roles.basic, connections = {}, tournaments = {}, parties = {}, crowns = 0) {
        const newUser = new usersSchema({
            entityBaseData,
            role: role,
            connections: connections,
            tournaments: tournaments,
            parties: parties,
            crowns: crowns
        });
        
        try {
            await newUser.save();
            res.status(HttpStatus.CREATED).json("saved successfully");
        } catch(error) {
            console.error('Error saving user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 'message': 'Error saving user' });
        }
    }
}

module.exports = UserHandler;