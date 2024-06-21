//const express = require('express');
const usersSchema = require('../schemas/usersSchemaModels');

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

    //check if a userName or mail is all ready taken
    //to do- in the mail, need to do a regx for only hte start of the mail and not the @
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

    const newUser = new usersSchema({
        userName: userName,
        password: password,
        mail: mail,
        connections: {},
        tournaments: [],
        parties: []
    });
    
    await newUser.save()
    .then(savedUser  => {
        res.status(201).json(savedUser);
    })
    .catch(error => {
        console.error('Error saving user:', error);
        res.status(500).json({ 'message': 'Error saving user' });
    });
}


const userInfo = async (req, res) => {
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
    }*/
    res.status(200).json({"fine" : "cool"});
};


const userCheck = async (req, res) => {
    res.status(200).json({"fine" : "cool"});
};

module.exports = {isExists, userInfo, createUser};