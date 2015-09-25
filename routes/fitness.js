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
    feet: req.body.feet,
    inches: req.body.inches,
    weight: req.body.weight,
    activity: req.body.activity,
    goal: req.body.goal
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
      calories: calories.calculateCalories(record.weight,record.feet,record.inches,record.age,record.sex,record.activity,record.goal)
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
  userCollection.updateById(req.params.id, { $set: {
    name: req.body.name,
    age: req.body.age,
    sex: req.body.sex,
    feet: req.body.feet,
    inches: req.body.inches,
    weight: req.body.weight,
    activity: req.body.activity,
    goal: req.body.goal
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/summary');
    });
});

router.post('/fitness/:id/day-added', function(req, res, next) {
  userCollection.updateById(req.params.id, { $push: {
    days: { date: req.body.date }
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.body.date);
    });
});

router.get('/fitness/:id/:date', function(req, res, next) {
  userCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('fitness/day-summary', {
      title: calories.dateFixer(req.params.date),
      user: record,
      foods: calories.foodSeparator(record.days,req.params.date),
      gained: calories.gained(calories.foodSeparator(record.days,req.params.date)),
      lost: calories.lost(calories.exerciseSeparator(record.days,req.params.date)),
      remaining: calories.remaining(calories.calculateCalories(record.weight,record.feet,record.inches,record.age,record.sex,record.activity,record.goal),calories.gained(calories.foodSeparator(record.days,req.params.date)),calories.lost(calories.exerciseSeparator(record.days,req.params.date))),
      exercises: calories.exerciseSeparator(record.days,req.params.date),
      date: req.params.date,
      goal: calories.calculateCalories(record.weight,record.feet,record.inches,record.age,record.sex,record.activity,record.goal)
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
  userCollection.update ({_id: req.params.id, 'days.date': req.params.date}, 
    {$push: {'days.$.foods': { meal: req.body.meal,
                               food: req.body.food,
                               calories: req.body.calories
    }}}, function (err, record){
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
  userCollection.update({ _id: req.params.id, 'days.date': req.params.date }, 
    { $push: {'days.$.exercises': { exercise: req.body.exercise,
                                    calories: req.body.calories
  }}}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.params.date);
    });
});

router.post('/fitness/:id/delete', function(req, res, next) {
  userCollection.remove({_id: req.params.id}, function (err, record) {
    res.redirect('/fitness');
  });
});

router.post('/fitness/:id/:date/delete-day', function(req, res, next) {
  userCollection.updateById(req.params.id, { $pull: {
    days: { date: req.params.date }
  }}, function (err, record) {
    res.redirect('/fitness/' + req.params.id + '/summary');
  });
});

router.post('/fitness/:id/:date/:food/delete-food', function(req, res, next) {
  userCollection.update ({_id: req.params.id, 'days.date': req.params.date}, 
    {$pull: {'days.$.foods': { food: req.params.food }
    }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.params.date);
  });
});

router.post('/fitness/:id/:date/:exercise/delete-exercise', function(req, res, next) {
  userCollection.update({ _id: req.params.id, 'days.date': req.params.date }, 
    { $pull: {'days.$.exercises': { exercise: req.params.exercise }
  }}, function (err, record){
      res.redirect('/fitness/' + req.params.id + '/' + req.params.date);
    });
});

module.exports = router;
