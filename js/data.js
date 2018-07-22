data = {};
funders = [];
startYear = 2008;
endYear = 2017;

allFunders = 'All funders';

themes = {
  genderEquality: 'Gender equality',
  mentalHealth: 'Mental health',
  transgender: 'Transgender',
  fakeNews: 'Fake news'
};

function getFunderAverageGrant(funderName) {
  var grants = [];
  
  for (var theme in data) {
    for (var year = startYear; year <= endYear; year++) {
      for (var i = 0; i < data[theme].grants[year].length; i++) {
        if (data[theme].grants[year][i].org === funderName && data[theme].grants[year][i].amount > 0) {
          grants.push(data[theme].grants[year][i].amount);
        }
      }
    }
  }
  
  return Math.round(arrayAverage(grants));
}

function getFunderBiggestGrant(funderName) {
  var grants = [];
  
  for (var theme in data) {
    for (var year = startYear; year <= endYear; year++) {
      for (var i = 0; i < data[theme].grants[year].length; i++) {
        if (data[theme].grants[year][i].org === funderName && data[theme].grants[year][i].amount > 0) {
          grants.push(data[theme].grants[year][i].amount);
        }
      }
    }
  }
  
  return Math.max(...grants);
}

function getAllFunders() {
  var funderName;
  
  for (var theme in data) {
    for (var year = startYear; year <= endYear; year++) {
      for (var i = 0; i < data[theme].grants[year].length; i++) {
        if (data[theme].grants[year][i].org !== allFunders &&
            !objectInArray(funders, 'name', data[theme].grants[year][i].org)) {
          funderName = data[theme].grants[year][i].org;
          funders.push({
            name: funderName,
            biggestGrant: getFunderBiggestGrant(funderName)
          });
        }
      }
    }
  }
  
  funders = funders.sort(sortByProperty('name'));
  
  funders.unshift({
    name: allFunders,
    biggestGrant: getFunderBiggestGrant(allFunders)
  });
}

function objectInArray(haystack, needleProperty, needleValue) {
  var found = false;
  for(var i = 0; i < haystack.length; i++) {
    if (haystack[i][needleProperty] === needleValue) {
      found = true;
      break;
    }
  }
  
  return found;
}

function sortByProperty(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

function arrayAverage(array) {
  return array.reduce((a,b) => a + b) / array.length;
}

$(document).ready(function() {
  for (var theme in themes) {
    data[theme] = window[theme];
  }
  
  getAllFunders();
  addChoices();
});
