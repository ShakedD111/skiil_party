//   http://localhost:3000/

//packages and libraries
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');


//db connection

//create server
const app = express();

// Parse JSON bodies
app.use(bodyParser.json());


//data Middlewares
//requests log
app.use('/*', (req, res, next) => {
    //logHandler(`${req.method}\t${req.path}\t${JSON.stringify(req.body)}`);
    next();
});


//documents: html
////app.use('/', require('./routers/mainRoute'));

//routes for th API's
////app.use('/api/users', require('./routers/api/usersAPI'));
////app.use('/api/tournaments', require('./routers/api/tournamentsAPI'));
////app.use('/api/parties', require('./routers/api/partiesAPI'));

//static files: pictures, css, front js
////app.use('/', express.static(path.join(__dirname, 'public')));


//errors hendler
app.get('*', (req,res) =>{
    res.status(404);
    
    if (req.accepts('html'))
    {
        //need to be sendFile
        res.statusCode(400).send('stupid');//will need to send the error page (send file)
    } else if (req.accepts('json')) {
        res.statusCode(400).json({ 'error' : '404 - not found'});
    } else {
        res.statusCode(400).send('stupid');
    }
});

//startServer
mongoose.connection.once('open', () => {
    console.log("connected to mongoDB");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
console.log("yey:)");