//const UsersSchemaModel = require('../schemas/usersSchemaModels');
const usersSchema = require('../schemas/usersSchemaModels').getModel();
const partiesSchema = require('../schemas/partiesSchemaModel').getModel();
const ConnectionsSchemaModel = require('../schemas/ConnectionsSchemaModel');
HandlerManager = require('./handlerManager');
//////const connectionModel = ConnectionsSchemaModel.getModel();
const roles = require('../roles');
///const { default: mongoose } = require('mongoose');

class PartiesHandler extends HandlerManager {
    constructor() {
        super();
    }

    static async getEntity(req, res){
        try {
            const partyID = req.params.partyID;

            //gets the party data
            const partyData = partiesSchema.findOne({_id: partyID}).exec();

            if (!party){
                req.status(401).json({massage: "party not found"});
            }

            //gets the users and their party data
            const usersData = await usersSchema.aggregate([
                { 
                    // Match users who have the specific partyID in their parties map
                    $match: {
                        [`parties.${partyID}`]: { $exists: true }
                    }
                },
                { $match: { userName: req.params.userName } },
                { $project: {
                    userName: 1,
                    [`parties.${partyID}`]: 1,
                    crowns: 1
                }}
            ]).exec();

            const dataMap = new Map();

            dataMap.set('party', partyData);
            dataMap.set('users', usersData);

            req.status(200).json(dataMap);
            } catch(error) {
            req.status(500).json({massage: "Internal Server Error"});
        }
    }

    // get entities by a filter
    static async getEntities(req, res, numOfEntities){
        try {
            
        } catch(error) {
            req.status(500).json({massage: "Internal Server Error"});
        }
    }

    static async createEntity(req, res){

    }

    static async deleteEntity(req, res){

    }

    static async updateEntity(req, res){

    }

    static async addUsersParty(req, res) {
        //body structer:
        /*
        {partyId:"id",
        newUsers: [{userName: "user", role: "leader", score: 56},{userName: "user", role: "member", score: 5}]
        }
        */

        //need to check if the update will cose no leader, and can be only one leader
        //check that the user can change someone role

        const bulkOps = req.body.newUsers.map(user => {
            const updateData = {};
            if(user.role) {
                updateData.role = user.role;
            } 
            if(user.joinDate) {
                updateData.joinDate = user.joinDate;
            }
            if(user.score) {
                updateData.score = user.score;
            }

            // need to add: before sending to the server need to check if every thing is valid 
            return {
                updateOne: {
                    filter: {userName: user.userName},
                    update: {
                        $set: {
                            [`parties.${req.body.partyId}`]: updateData
                        }
                    },
                    upsert: true
                }
                
            }
        });


        try {
            const result = await usersSchema.bulkWrite(bulkOps);

            res.status(200).json({massage: "update was completed"});
        } catch (error) {
            res.status(500).json({ message: 'Error performing operation', error });
        }
        
    }

    static async updateUsersParty(req, res) {
        //body structer:
        /*
        {partyId:"id",
        newUsers: [{userName: "user", role: "leader"},{userName: "user", role: "member"}]}
        */

        req.body.newUsers.array.forEach(element => {
            //get the 
        });
        
    }

    static async deleteUsersParty(req, res) {
        //body structer:
        /*
        {partyId:"id",
        newUsers: [{userName: "user", role: "leader"},{userName: "user", role: "member"}]}
        */

        req.body.newUsers.array.forEach(element => {
            //get the 
        });
        
    }
}


module.exports = PartiesHandler; 