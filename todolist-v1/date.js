//jshint esversion:6

// module.exports = getDate;

module.exports.getDate = function getDate(){
  var today = new Date();
  var options = {weekday:'long', day:'numeric', month:'long'};
  const day =today.toLocaleDateString("en-US",options);
    return day;
};
