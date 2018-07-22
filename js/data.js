data = {};
funders = [];
startYear = 2008;
endYear = 2017;

themes = {
  fakeNews: 'Fake news',
  genderEquality: 'Gender equality',
  mentalHealth: 'Mental health',
  transgender: 'Transgender'
};

function getAllFunders() {
  for (var theme in data) {
    for (var year = startYear; year <= endYear; year++) {
      for (var i = 0; i < data[theme]['grants'][year].length; i++) {
        if (data[theme]['grants'][year][i]['org'] !== 'All funders' && $.inArray(data[theme]['grants'][year][i]['org'], funders) === -1) {
          funders.push(data[theme]['grants'][year][i]['org']);
        }
      }
    }
  }
}



$(document).ready(function() {
  for (var theme in themes) {
    data[theme] = window[theme];
  }
  
  getAllFunders();
});
