//   http://localhost:3000/

//packages and libraries
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dbConnection = require('./config/mongoConnection');

class Server{

    _app
    constructor() {
        this._app = express();
        
        //connect to the db
        /*try {
            await dbConnection.connectDB(mongoose);
        } catch (error){
            console.error("Failed to connect to MongoDB", error);
        }*/
        
    }

    middlewares(){
        // Parse JSON bodies
        this._app.use(bodyParser.json());

        //log handler
        this._app.use('/*', (req, res, next) => {
            //logHandler(`${req.method}\t${req.path}\t${JSON.stringify(req.body)}`);
            next();
        });
    }

    routes(){
        //documents: html
        ////app.use('/', express.static(path.join(__dirname, 'public')));
        //routes for the API's
        
        this._app.use('/api/users', require('./routers/api/usersAPI'));
        //this._app.use('/api/parties', require('./routers/api/partiesAPI'));
        ////app.use('/api/tournaments', require('./routers/api/tournamentsAPI'));
        ////app.use('/api/parties', require('./routers/api/partiesAPI'));
        
        //static files: pictures, css, front js
        ////app.use('/', require('./routers/mainRoute'));
    }

    errorHandler(){
        //errors handler
        this._app.get('*', (req,res) => {
            res.status(404);
        
            if (req.accepts('html'))
            {
                //need to be sendFile
                res.status(400).send('stupid html');//will need to send the error page (send file)
            } else if (req.accepts('json')) {
                res.status(400).json({ 'error' : '404 - not found'});
            } else {
                res.status(400).send('stupid');
            }
        }); 
    }

    createConnection(){
        
        try {
            dbConnection.connectDB(mongoose);
            mongoose.connection.once('open', () => {
                console.log("connected to mongoDB");

                this.middlewares()
                this.routes()
                this.errorHandler()

                this._app.listen(3000, () => {
                  console.log('Server is running on port 3000');
                });
              })
        } catch (error) {
            console.error("error in connecting to mongoDB", error);
        }
    }
}

module.exports = Server;