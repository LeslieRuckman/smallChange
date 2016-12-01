var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); // mongoDB library
var geocoder = require('geocoder'); // geocoder library

// our db model
var Organization = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'name': 'ngos-for-good',
  	'api-status':'OK'
  }

  // respond with json data
  // res.json(jsonData)
  res.render('home.html');

});

// simple route to show the pets html
router.get('/pets', function(req,res){
  res.render('pets.html');
})

 // demo walk through webages
router.get('/home', function(req,res){
  res.render('home.html');
})

router.get('/makesmallchange', function(req,res){
  res.render('start.html');
})

router.get('/select', function(req,res){
  res.render('select.html');
})

router.get('/register', function(req,res){
  res.render('form.html');
})

router.get('/congrats', function(req,res){
  res.render('congrats.html');
})

router.get('/mysmallchange', function(req,res){
  res.render('dashboard.html');
})


// API Display Page

router.get('/apiview', function(req,res){
  res.render('orgDirectory.html');
})

// API Add an Organization Page

router.get('/apiadd', function(req,res){
  res.render('orgDirectoryAdd.html');
})

// Edit Existing Information Page

router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  Organization.findById(requestedId,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    console.log(data);

    var viewData = {
      pageTitle: "Edit " + data.name,
      orgz: data
    }

    res.render('edit.html',viewData);

  })

})



// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log('the data we received is --> ')
    console.log(req.body);

var orgObj = {
    name: req.body.name,
    category: req.body.category.split(","),
    tags: req.body.tags.split(","), // split string into array
    rating: req.body.rating,
    link: req.body.link
  }

    // now, let's save it to the database
    // create a new organization model instance, passing in the object we've created
    var orgz = new Organization(orgObj);



  orgz.save(function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    var jsonData = {
      status: "OK",
      orgz: data
    }

    return res.json(jsonData);

  })


});


// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.param('id'). The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Organization.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find what you\'re looking for.'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      orgz: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Animal.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find organizations'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      orgz: data
    }

    res.json(jsonData);

  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.param('id'). The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var name, category, tags, rating, link;

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      name = req.body.name;
      // add to object that holds updated data
      dataToUpdate['name'] = name;
    }
    if(req.body.category) {
      category = req.body.category.split(",");
      // add to object that holds updated data
      dataToUpdate['category'] = category;
    }
    if(req.body.tags) {
      tags = req.body.tags.split(",");
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }
    if(req.body.rating) {
      rating = req.body.rating;
      // add to object that holds updated data
      dataToUpdate['rating'] = rating;
    }
    if(req.body.link) {
      link = req.body.link;
      // add to object that holds updated data
      dataToUpdate['link'] = link;
    }

      console.log('the data to update is ' + JSON.stringify(dataToUpdate));

      // now, update that animal
      // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
      Organization.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
        // if err saving, respond back with error
        if (err){
          var error = {status:'ERROR', message: 'Error updating this organization'};
          return res.json(error);
        }

        console.log('Your update was made!');
        console.log(data);

        // now return the json data of the new person
        var jsonData = {
          status: 'OK',
          orgz: data
        }

        return res.json(jsonData);

      })
})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Organization.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that organization to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;
