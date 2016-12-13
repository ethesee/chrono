// Module dependencies.
var application_root = '.',
    express = require("express"), //Web framework
    formidable = require('formidable'), //middleware helps in parsing form data.
    path = require("path"), //Utilities for dealing with file paths
    util = require('util'),
    multer = require('multer'),
    fs = require('fs-extra'),
    mongoose = require('mongoose'); //MongoDB integration


 
//Create server
var app = express.createServer();
 
// Configure server
app.configure(function () {
    app.use(express.bodyParser()); //parses request body and populates req.body
    //app.use(express.bodyParser({uploadDir:'./uploads'}));
    app.use(express.methodOverride()); //checks req.body for HTTP method overrides
    app.use(app.router); //perform route lookup based on url and HTTP method
    app.use(express.static(path.join(application_root, "public"))); //Where to serve static content
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true })); //Show all errors in development
    
});
 
//Start server
app.listen(4711, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Routes
app.get('/api', function(req, res){
    res.send('service API is running');
});

//Connect to database
mongoose.connect('mongodb://localhost/chrono_database');

//Schemas
// var Keywords = new mongoose.Schema({
    // keyword: String
// });



var Clock = new  mongoose.Schema({
    company:String,
    protocol:String,
    checked: Boolean,
    owner: String,
    timers: [{start: String, timer: Number}],
    control: {start: String, interval: Number, seconds: Number}
});
 
//Models
var ClockModel = mongoose.model('Clock', Clock);

//Get a list of all books
app.get('/api/clocks', function (req, res) {
    return ClockModel.find(function (err, clocks) {
        if (!err) {
            console.log("returning clocks");
            return res.send(clocks);
        } else {
            console.log("error getting clocks")
            return console.log(err);
        }
    });
});

app.get('/api/clocks/:id', function(req, res){
    return ClockModel.findById(req.params.id, function(err, clock){
        if(!err){
            return res.send(clock);
        } else {
            return console.log(err);
        }
    });
});


app.post('/api/clocks', function (req, res) {
    
    console.log("post req:", req);
    var clock = new ClockModel({
        company:req.body.company,
        protocol:req.body.protocol,
        checked: req.body.checked,
        owner: req.body.owner,
        timers: req.body.timers,
        control: req.body.control
    });
    clock.save(function (err) {
            if (!err) {
                return console.log('created');
            } else {
                return console.log(err);
            }
    });
     
   
    
    
    return res.send(clock);
});

app.put('/api/clocks/:id', function(req, res){
    console.log('Updating clock ' + req.body.company);
    return ClockModel.findById(req.params.id, function(err, clock){
        clock.company = req.body.company;
        clock.protocol = req.body.protocol;
        clock.checked = req.body.checked;
        clock.owner = req.body.owner;
        clock.timers = req.body.timers;
        clock.control = req.body.control;

        return clock.save(function(err){
            if(!err){
                console.log('clock updated');
            } else {
                console.log(err);
            }
            return res.send(clock);
        });
    });
});

app.delete('/api/clocks/:id', function(req, res){
    console.log('Deleting clock with id: ' + req.params.id);
    return ClockModel.findById(req.params.id, function(err, clock){
             
        	return clock.remove(function(err){
	            if(!err){
	                console.log('clock removed');
	                return res.send('');
	            } else {
	                console.log(err);
	            }
	        });
    });
});



