//const express = require('express');
//const usersSchema = require('../schemas/usersSchemaModels');
const {UsersSchemaModel, ConnectionsSchemaModel} = require('../schemas/abstarctSchemaModelManager');
const usersSchema = UsersSchemaModel.getModel();
const connectionModel = ConnectionsSchemaModel.getModel();
const roles = require('../roles');

/**
 * Checks if a user with the specified name (username or email) and password exists in the database.
 * 
 * @param {string} name - The username or email of the user to check.
 * @param {string} password - The password of the user to check.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the result of the check:
 *                              - valid: The user document if found, otherwise null.
 *                              - error: Boolean indicating if an error occurred.
 *                              - status: HTTP status code indicating the result (200 for success, 404 for not found, 500 for error).
 *                              - msg: A message describing the result ("user exists", "user not found", or "error in the server").
 */
async function checkExists(name, password){
    try{
        const exists = await usersSchema.findOne({
            $and: [
                {$or: [
                        {userName: name},
                        {mail: name}
                    ]} ,
                {password: password}
                ]
            }).exec();
        
        ////console.log(exists;

        return {
            valid: exists,
            error: false,
            status: exists ? 200 : 404,
            msg: exists ? "user Exists" : "user not found"
        };
    } catch(error) {
        console.error(error);

        return {
            valid: false,
            error: true,
            status: 500,
            msg: "error in the server"
        };
    }
}

/**
 * Checks if a user with the specified name (username or email) and password exists in the database,
 * and sends an appropriate response to the client.
 * 
 * @param {Object} req - The request object from the client, containing the user's input data.
 * @param {Object} res - The response object used to send a response back to the client.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const isExists = async (req, res) => {
    //getting data from the request's body
    const { name, password } = req.body;

    // checking if the user exists in the DB  
    //name used for userName/mail
    await checkExists(name, password).then(result => {
        console.log(result);

        res.status(result.status).json({"msg": result.msg});
    });

}


const createUser = async(req, res) => {
    console.log(req.body);
    const {userName, password, mail} = req.body;

    // Check if all required fields are provided
    if(!userName || !password || !mail){
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
        res.status(409).json({'message' : `you piss of shit, you can not take a different user details`});
        return;
    }

    console.log(roles.basic);

    // creating a schema with the new user details and adding him to the DB
    // In the creating of a new user, the connections, tournaments and paries should be empty
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
}


const updateUser = async(req, res) => {
    const {oldUserName, newUser} = req.body;

    if (!oldUserName || !newUser || typeof newUser !== 'object') {
        return res.status(400).json({ message: 'Invalid input' });
    }

    //check if user exists
    //check if the user is already taken
    const isExists = await usersSchema.findOne({userName: oldUserName}).exec();

    if(!isExists){
        res.status(409).json({'message' : `the user does not exists...`});
        return;
    }

    //check if the user is already taken
    const taken = await usersSchema.findOne({
        $and: [
            {userName: { $ne: oldUserName }}  ,
            {$or: [
                {userName: newUser.userName},
                {mail: newUser.mail}
            ]}
        ]
    }).exec();

    if(taken){
        res.status(409).json({'message' : `you can not take a different user details`});
        return;
    }
    

    // need to check if the user can update the oldUser details 
    //need to check by the user that requested
    const activeUserName = "rmbo1";
    const activeUser = await usersSchema.findOne({userName: activeUserName});
    const updatedUser = await usersSchema.findOne({userName: oldUserName});

    console.log(activeUser.role);
    console.log(updatedUser.role);

    switch(activeUser.role){
        case roles.admin:
            if(activeUser !== oldUserName && updatedUser.role === roles.admin){
                return res.status(400).json({ message: 'you can not do this!!' });
            }
            break;
        case roles.basic:
            if(activeUser !== oldUserName){
                return res.status(400).json({ message: 'you can not do this!!' });
            }
            break;
        default:
            return res.status(400).json({ message: 'what is that role???? R u an hacker?' });
    }

    const updateAct = await usersSchema.updateOne(
        {userName: oldUserName},
        {$set: newUser},
        {new: true, runValidators: true}
    ).then(updatedUser  => {
        res.status(201).json(updatedUser);
    })
    .catch(error => {
        console.error('Error saving user:', error);
        res.status(500).json({ 'message': 'Error saving user' });
    });
}


const userInfo = async (req, res) => {

    //**to do**
    //check if can access user info using token
    console.log(req.params.userName);
    const user = await UsersSchemaModel.getModel().aggregate([
        { $match: { userName: req.params.userName } },
        { $project: {
            userName: 1,
            mail: 1,
            role: 1,
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



    /*console.log(req.body);
    const name = req.query.name;
    const password = req.query.password;
    
    const exists = await usersModel.findOne({
        $and: [
            {$or: [
                    {userName: name},
                    {mail: name}
                ]} ,
            {password: password}
            ]
        }).exec();


    if(exists){
        // what t odd??????
        res.status(200).json({id: exists._id});
    }
    else{
        res.status(404).json({'message' : `&{userName} does not exist`});
    }
    res.status(200).json({"fine" : "cool"});*/
};


const userCheck = async (req, res) => {
    res.status(200).json({"fine" : "cool"});
};

module.exports = {isExists, userInfo, createUser, updateUser};