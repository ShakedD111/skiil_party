const mongoConnection = require('./mongoConnection');

async function isFieldsTaken(model, fields = {}) {
    
    const pipeLine = [
        {
            $match: {
                $or: Object.entries(fields).map(([key, value]) => ({ [key]: value }))
            }
        },
        {
            $limit: 1
        }
    ];

    /*const options = {
        $limit : 1
    };*/

    try{
        return await mongoConnection.aggregateHandler(model, pipeLine);
    } catch (error) {
        console.log(error);
        throw {isFieldsTaken: error};
    }
}

async function getEntityList(model, fields = {}, limit = 0) {
    const pipeline =  [
        { $match: fields},
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
    ];

    
    
    if ( limit !== 0 ) {
        pipeline.push({$limit: limit});
    }

    try{
        return await mongoConnection.aggregateHandler(model, pipeline);
    } catch (error) {
        console.log("error in userDbHandler.getEntityList");
        throw error;
    }
}




module.exports = {isFieldsTaken, getEntityList};