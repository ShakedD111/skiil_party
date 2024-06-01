//const express = require('express');
const schema = require('../schemas/usersSchemaModels');


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

module.exports = {userInfo, userCheck};