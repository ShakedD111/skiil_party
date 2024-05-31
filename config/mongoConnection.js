const mongoose = require('mongoose');
const uri = "mongodb+srv://shakeddror28:kOigZwWlJQdvCkC5@cluster0.avuahfk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    
  } catch(error) {
    console.error(error);
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

module.exports = {connectDB, checkConnection};