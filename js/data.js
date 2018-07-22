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

function getAllFunders() {
  for (var theme in data) {
    for (var year = startYear; year <= endYear; year++) {
      for (var i = 0; i < data[theme]['grants'][year].length; i++) {
        if (data[theme]['grants'][year][i]['org'] !== allFunders && $.inArray(data[theme]['grants'][year][i]['org'], funders) === -1) {
          funders.push(data[theme]['grants'][year][i]['org']);
        }
      }
    }
  }
  
  funders.sort();
  funders.unshift(allFunders);
}

$(document).ready(function() {
  for (var theme in themes) {
    data[theme] = window[theme];
  }
  
  getAllFunders();
  addChoices();
});
