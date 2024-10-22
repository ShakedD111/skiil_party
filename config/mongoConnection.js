//const mongoose = require('mongoose');
const uri = "mongodb+srv://shakeddror28:kOigZwWlJQdvCkC5@cluster0.avuahfk.mongodb.net/AppDB?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB(mongoose) {
  try {
    await mongoose.connect(uri);
    
  } catch(error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}

const checkConnection = (app) => {
  mongoose.connection.once('open', () => {
    console.log("connected to mongoDB");
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
};

async function aggregateHandler(model, pipeline) {  
  try{
    console.log(pipeline);
    return await model.aggregate(pipeline);
  } catch ( error ) {
    console.log("error in aggregateHandler");
    throw {aggregateError: error};
  }
  /*Object.entries(options).forEach(([key, value]) => {
    if(typeof aggregate[key] === 'function') {
      aggregate = aggregate[key](value);
    }
  });
  
  try {
    return await aggregate.exec();
  } catch (error) {
    console.log("error in aggregateHandler");
    throw {executionError: error};
  }*/
}

module.exports = {connectDB, checkConnection, aggregateHandler};