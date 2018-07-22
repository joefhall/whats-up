chat = [];
bubbleDelay = 500;

function addBubble(side, text) {
  
}

function showChat() {
  
}

function getChatData() {
  var grants;
  var funderBiggestGrant;
  var yearData = {};
  var allData = [];
  
  for (var i = startYear; i < endYear; i++) {
    funderBiggestGrant = 0;
    yearData = {
      grant: 0,
      popularity: null
    };

    grants = data[current.theme].grants[i];
    
    for (var j = 0; j < funders.length; j++) {
      if (funders[j].name === current.funder) {
        funderBiggestGrant = funders[j].biggestGrant;
      }
    }
    
    for (j = 0; j < grants.length; j++) {
      if (grants[j].org === current.funder) {
        yearData.grant = Math.ceil(grants[j].amount / funderBiggestGrant * 5);
      }
    }
    
    yearData.popularity = Math.ceil(data[current.theme].popularity[i] / 20);
    
    allData.push(yearData);
  }
  
  return allData;
}
