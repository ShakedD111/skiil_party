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

    static async createEntity(req, res) {
        try {
            const {userName, password, mail} = req.body;

            // Check if all required fields are provided
            if(!userName || !password || !mail) {
                console.log(userName);
                console.log(password);
                console.log(mail);
                res.status(409).json({'message' : `you forgot something`});
                return;
            }

            //need to do - check valid data

            //check if a userName or mail is already taken
            const taken = await usersSchema.findOne({
                $or: [
                    {userName: userName},
                    {mail: mail}
                ]
            }).exec();

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
                userName: userName,
                password: password,
                mail: mail,
                role: roles.basic,
                connections: connectionsMap,
                tournaments: [],
                parties: []
            });
            
            await newUser.save()
            .then(savedUser  => {
                res.status(201).json("saved successfully");
            })
            .catch(error => {
                console.error('Error saving user:', error);
                res.status(500).json({ 'message': 'Error saving user' });
            });
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

            console.log(oldUserName);
            console.log(updateData);

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

            for( var i = 0; i < conditions.length; i++) { console.log(conditions[i])};
            console.log(conditions.length);
            
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
            switch(activeUser.role){
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

            const updateAct = await usersSchema.updateOne(
                {userName: oldUserName},
                {$set: updateData},
                {new: true, runValidators: true}
            ).then(updatedUser  => {
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
}

module.exports = UserHandler;