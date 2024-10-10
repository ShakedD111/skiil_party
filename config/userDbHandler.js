const mongoConnection = require('./mongoConnection');

async function isFieldsTaken(model, fields = {}) {
    
    const pipeLine = [
        {
            $match: {
                $or: Object.entries(fields).map(([key, value]) => ({ [key]: value }))
            }
        }
    ];

    const options = {
        $limit : 1
    };

    

    try{
        return await mongoConnection.aggregateHandler(model, pipeLine, options);
    } catch (error) {
        console.log(error);
        throw {isFieldsTaken: error};
    }
}




module.exports = {isFieldsTaken};