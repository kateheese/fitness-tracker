var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/fitness-tracker');
var userCollection = db.get('users');
var calories = require('../public/javascripts/cal.js');

router.get('/fitness', function(req, res, next) {
  userCollection.find({}, function (err, records) {
  res.render('fitness/index', { title: 'Fitness Tracker', users: records});
  });
});

router.get('/fitness/new', function(req, res, next) {
  res.render('fitness/new', { title: 'New User' });
});

router.post('/fitness', function(req, res, next) {
  userCollection.insert({ 
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    height: req.body.height,
    weight: req.body.weight,
    activity: req.body.activity
  }, function (err, record) {
    res.redirect('/fitness/' + record._id + '/summary');
  });
});

router.get('/fitness/:id/summary', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/summary', {
      title: 'Summary',
      user: record,
      days: record.days,
      calories: calories.calculateCalories(record.weight,record.height,record.age,record.sex,record.activity)
    });
  });
});

router.get('/fitness/:id/edit', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/edit', {
      title: 'Edit User',
      user: record
    });
  });
});

router.post('/fitness/:id/update', function(req, res, next) {
  userCollection.updateById(req.params.id, {
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    height: req.body.height,
    weight: req.body.weight,
    activity: req.body.activity
  }, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/summary');
    });
});

router.post('/fitness/:id/day-added', function(req, res, next) {
  userCollection.updateById(req.params.id, { $push: {
    days: { date: req.body.date,
            foods: [],
            exercise: [] }
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.body.date);
    });
});

router.get('/fitness/:id/:date', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/day-summary', {
      title: calories.dateFixer(req.params.date),
      user: record,
      date: req.params.date,
      calories: calories.calculateCalories(record.weight,record.height,record.age,record.sex,record.activity)
    });
  });
});

router.get('/fitness/:id/:date/add-food', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/food', { 
      title: 'Add Food',
      user: record,
      date: req.params.date
    });
  });
});

router.post('/fitness/:id/:date/food-added', function(req, res, next) {
  userCollection.update({ date: req.params.date }, { $push: {
    foods: { meal: req.body.meal,
             food: req.body.food,
             calories: req.body.calories }
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.params.date);
    });
});

router.get('/fitness/:id/:date/add-exercise', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/exercise', { 
      title: 'Add Exercise',
      user: record,
      date: req.params.date
    });
  });
});

router.post('/fitness/:id/:date/exercise-added', function(req, res, next) {
  userCollection.update({ date: req.params.date }, { $push: {
    exercises: { exercise: req.body.exercise,
                 calories: req.body.calories }
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.params.date);
    });
});

router.post('/fitness/:id/delete', function(req, res, next) {
  userCollection.remove({_id: req.params.id}, function (err, record) {
    res.redirect('/fitness');
  });
});

module.exports = router;
