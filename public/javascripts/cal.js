var calories = {
  calculateCalories: function(weight,feet,inches,age,sex,activity,goal) {
    var BMR = 0;
    if(sex === 'male') {
      BMR += (66.47 + (13.75*(weight/2.2)) + (5.0*((feet*12+ parseInt(inches))*2.54)) - (6.75*age));
    }
    if(sex === 'female') {
      BMR += (665.09 + (9.56*(weight/2.2)) + (1.84*((feet*12+ parseInt(inches))*2.54)) - (4.67*age));
    }
    if(goal === 'maintain') {
      return Math.floor(BMR*activity);
    }
    if(goal === 'lose') {
      return Math.floor(BMR*activity) - 500;
    }
        if(goal === 'gain') {
      return Math.floor(BMR*activity) + 500;
    }
  },
  dateFixer: function(date) {
    var arr = date.split('-');
    var newArr = [];
    newArr.push(arr[1]);
    newArr.push(arr[2]);
    newArr.push(arr[0]);
    return newArr.join('.');
  },
  gained: function(food) {
    var count = 0;
    if(food) {
      for(var i = 0; i < food.length; i++) {
        count += parseInt(food[i].calories);
      }
      return count.toString();
    } else {
      return '0';
    }
  },
  lost: function(exercise) {
    var count = 0;
    if(exercise) {
      if(exercise.length == 0) {
        return 0;
      }
      for(var i = 0; i < exercise.length; i++) {
        count += parseInt(exercise[i].calories);
      }
      return count.toString();
    } else {
      return 0;
    }
  },
  remaining: function(goal,food,exercise) {
    return parseInt(goal) - parseInt(food) + parseInt(exercise);
  },
  total: function(goal,lost) {
    return parseInt(goal) + parseInt(lost);
  },
  foodSeparator: function(arr,day) {
    if(arr) {
      for(var i = 0; i < arr.length; i++) {
        if(arr[i].date == day) {
          if(arr[i].foods) {
            return arr[i].foods;
          } else {
            return [];
          }
        }
      }
    } else {
      return [];
    }
  },
  exerciseSeparator: function(arr,day) {
    if(arr) {
      for(var i = 0; i < arr.length; i++) {
        if(arr[i].date == day) {
          if(arr[i].exercises) {
            return arr[i].exercises;
          } else {
            return [];
          }
        }
      }
    } else {
      return [];
    }
  }
};

module.exports = calories;