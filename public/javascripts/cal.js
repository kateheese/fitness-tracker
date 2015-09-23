var calories = {
  calculateCalories: function(weight,height,age,sex,activity) {
    var BMR = 10 * weight + 6.25 * height - 5 * age + Number(sex);
    return Math.floor(BMR * activity);
  },
  dateFixer: function(date) {
    var arr = date.split('-');
    var newArr = [];
    newArr.push(arr[1]);
    newArr.push(arr[2]);
    newArr.push(arr[0]);
    return newArr.join('/');
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
  breakfast: function(arr) {
    return arr.map(function(obj) {
      if(obj.meal === 'breakfast') {
        return obj;
      }
    })
  },
  lunch: function(arr) {
    return arr.map(function(obj) {
      if(obj.meal === 'lunch') {
        return obj;
      }
    })
  },
  dinner: function(arr) {
    return arr.map(function(obj) {
      if(obj.meal === 'dinner') {
        return obj;
      }
    })
  },
  snack: function(arr) {
    return arr.map(function(obj) {
      if(obj.meal === 'snack') {
        return obj;
      }
    })
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