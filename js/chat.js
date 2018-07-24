chat = [];
bubble = 0;
bubbleDelay = {
  about: 4500,
  genderEquality: 1500,
  mentalHealth: 1500,
  transgender: 1500,
  fakeNews: 1500
};
intervalTimer = null;

speechBubbleHtml = {
  left: '<div class="pl-4"><div class="speech-bubble speech-bubble-left [classes]">[text]</div></div>',
  right: '<div class="text-right pr-4"><div class="speech-bubble speech-bubble-right [classes]">[text]</div></div>'
};
yearHtml = '<div class="divider year my-2">[year]</div>';

talking = {
  'yes': '😛',
  'no': '🤐'
};
money = {
  'yes': '🤑',
  'no': '🤐'
};

aboutText = [
  {
    about: 'Welcome! <em>What\'s Up?</em> shows four issues that have risen up the public agenda in the last ten years'
  },
  {
    about: 'It compares public interest in that issue, measured by Google search popularity (' + talking.yes + ') against grant funding to charities and others (' + money.yes + ')'
  },
  {
    about: 'Did funders lead the way on an issue ahead of public interest? Did they follow the public? Lag behind? Ignore them completely?'
  },
  {
    about: 'It\'s important to know that each is a <em>relative</em> measure.'
  },
  {
    about: 'Each public interest bubble shows 1 to 5 ' + talking.yes + '\'s for the popularity of that issue, relative to the popularity of all other Google searches that year.'
  },
  {
    about: 'Each funding bubble shows 1 to 5 ' + money.yes + '\'s for how much the funder gave for that issue, relative to the maximum they gave <em>for that issue</em> in any year.'
  },
  {
    about: '(Did funders give enough in absolute terms? This tool isn\'t designed to tell you that.)'
  },
  {
    about: 'The aim is to provoke questions...'
  },
  {
    about: 'Are funders ahead of the curve on emerging issues of public interest? Or are they more conservative?'
  },
  {
    about: 'Should funding respond to public opinion at all? Or should funders lead the way in championing unpopular causes?'
  },
  {
    about: 'Maybe funders just respond to the applications they get... or maybe funders should be pioneering rather than reacting?'
  },
  {
    about: 'Hopefully the chat-style interface also brings to life the data in a fresh, simple, relevant and interesting way 😉'
  },
  {
    about: 'Scroll down to the bottom of the screen for credits, data sources and details. Thanks 👏'
  },
];

function addBubble(bubbleData) {
  var speechBubble = '';
  var yearDivider = '';
  var popularityEmojis = '';
  var grantEmojis = '';
  
  if (bubbleData.hasOwnProperty('pause')) {
    yearDivider = yearHtml;
    yearDivider = yearDivider.replace('[year]', bubbleData.year);
    $('#chat-holder').append(yearDivider);
    
    $('#typing').text('The public are typing...');
  } else if (bubbleData.hasOwnProperty('popularity')) {
    speechBubble = speechBubbleHtml.right;
    popularityEmojis = bubbleData.popularity > 0 ? talking.yes.repeat(bubbleData.popularity) : talking.no;
    speechBubble = speechBubble.replace('[text]', popularityEmojis);
    speechBubble = speechBubble.replace('[classes]', '');
    
    $('#typing').text(current.funder + ((current.funder === allFunders) ? ' are typing...' : ' is typing...'));
  } else if (bubbleData.hasOwnProperty('grant')) {
    speechBubble = speechBubbleHtml.left;
    grantEmojis = bubbleData.grant > 0 ? money.yes.repeat(bubbleData.grant) : money.no;
    speechBubble = speechBubble.replace('[text]', grantEmojis);
    speechBubble = speechBubble.replace('[classes]', '');
    
    $('#typing').text('');
  } else if (bubbleData.hasOwnProperty('about')) {
    speechBubble = speechBubbleHtml.right;
    speechBubble = speechBubble.replace('[text]', bubbleData.about);
    speechBubble = speechBubble.replace('[classes]', 'speech-bubble-about');
    
    $('#typing').text(bubble < (chat.length - 1) ? 'What\'s Up? is typing...' : '');
  }
  
  $('#chat-holder').append(speechBubble);
  $('#chat-holder').scrollTop($('#chat-holder')[0].scrollHeight);
}

function stopChat() {
  clearInterval(intervalTimer);
}

function destroyChat() {
  chat = [];
  bubble = 0;
  $('#chat').find('.year').remove();
  $('#chat').find('.speech-bubble').remove();
}

function showChat() {  
  $('#chat-funder').text(current.funder);
  $('#chat-image-funder').attr('src', 'img/funders/' + current.funder + '.jpg');
  $('#chat-theme').text(current.theme === 'about' ? 'About' : themes[current.theme]);
  $('#chat-image-theme').attr('src', 'img/themes/' + current.theme + '.jpg');
  
  getChatData();
  console.log(chat);
  
  intervalTimer = setInterval(function() {
    if (bubble < chat.length) {
      addBubble(chat[bubble]);
      bubble += 1;
    } else {
      clearInterval(intervalTimer);
    }
  }, bubbleDelay[current.theme]);
}

function getChatData() {
  var grants;
  var funderAverageGrant;
  var funderBiggestGrant;
  var yearGrant = {};
  var yearPopularity = {};
  var pause = {};
  
  if (current.theme === 'about') {
    chat = aboutText;
  } else {
    var funderThemeBiggestGrant = getFunderThemeBiggestGrant(current.funder, current.theme);
    
    for (var i = startYear; i <= endYear; i++) {
      funderAverageGrant = 0;
      funderBiggestGrant = 0;
      yearGrant = {
        year: i,
        grant: 0
      };
      yearPopularity = {
        year: i,
        popularity: null
      };
      pause = {
        year: i,
        pause: 'pause'
      }

      chat.push(pause);

      grants = data[current.theme].grants[i];

      for (var j = 0; j < funders.length; j++) {
        if (funders[j].name === current.funder) {
          funderAverageGrant = funders[j].averageGrant;
          funderBiggestGrant = funders[j].biggestGrant;
        }
      }

      for (j = 0; j < grants.length; j++) {
        if (grants[j].org === current.funder) {
          yearGrant.grant = funderThemeBiggestGrant > 0 ? Math.ceil(grants[j].amount / funderThemeBiggestGrant * 5) : 0;
        }
      }

      yearPopularity.popularity = Math.round(data[current.theme].popularity[i] / 20);

      chat.push(yearPopularity);
      chat.push(yearGrant);
    }
  }
}
