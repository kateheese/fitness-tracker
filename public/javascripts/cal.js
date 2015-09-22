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
  remaining: function(goal,food,exercise) {
    return goal - food + exercise;
  }
};

module.exports = calories;