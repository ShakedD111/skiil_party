//const express = require('express');
const usersSchema = require('../schemas/usersSchemaModels');


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


const isExists = async (req, res) => {
    //getting data from the request's body
    ////const { name, password } = req.body;
    ////console.log(name + " " + password);

    // checking if the user exists in the DB  
    //name used for userName or mail
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