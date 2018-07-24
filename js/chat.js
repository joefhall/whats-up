chat = [];
bubble = 0;
bubbleDelay = {
  about: 4500,
  genderEquality: 1500,
  mentalHealth: 1500,
  transgender: 1500,
  fakeNews: 1500,
  pause: 850
};
intervalTimer = null;

speechBubbleHtml = {
  left: '<div class="pl-4"><div class="speech-bubble speech-bubble-left [classes]">[text]</div></div>',
  right: '<div class="text-right pr-4"><div class="speech-bubble speech-bubble-right [classes]">[text]</div></div>'
};
yearHtml = '<div class="divider year my-2">[year]</div>';

talking = {
  yes: '<img class="emoji" src="img/emoji-talking.png" alt="Emoji of face with tongue sticking out">',
  no: '<img class="emoji" src="img/emoji-no.png" alt="Emoji of face with zip across mouth">',
};
money = {
  yes: '<img class="emoji" src="img/emoji-money.png" alt="Emoji of face with dollar bills on eyes and mouth">',
  no: '<img class="emoji" src="img/emoji-no.png" alt="Emoji of face with zip across mouth">',
};

aboutText = [
  {
    about: 'Welcome! <em>What\'s Up?</em> features four issues that have risen up the public agenda in the last decade'
  },
  {
    about: 'Did grant funders lead the way supporting charities and groups working on these issues, before they got big public attention?'
  },
  {
    about: 'Did they follow the public? Lag behind? Ignore them completely?'
  },
  {
    about: '<em>What\'s Up?</em> shows public interest in each issue, measured by Google search popularity ' + talking.yes + ' against grant funding to charities and others ' + money.yes
  },
    {
    about: '(If there was very little public interest or no funding that year, you\'ll see ' + money.no + ')'
  },
  {
    about: 'It\'s important to know that each is a <em>relative</em> measure'
  },
  {
    about: 'Each public interest bubble shows up to five <div class="d-inline">' + stringRepeat(talking.yes, 5) + '</div> for the popularity of that issue, relative to the popularity of all other Google searches that year'
  },
  {
    about: 'Each funding bubble shows up to five <div class="d-inline">' + stringRepeat(money.yes, 5) + '</div> for how much <em>that funder</em> gave for that issue, relative to the maximum they gave <em>for that issue</em> in any year'
  },
  {
    about: '(Did funders give enough in absolute terms? This tool isn\'t designed to tell you that)'
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
    about: 'Hopefully the chat-style interface also brings to life the data in a fresh, simple, relevant and interesting way <img class="emoji" src="img/emoji-wink.png" alt="Emoji of winking face">'
  },
  {
    about: 'Scroll down to the bottom of the screen for credits, data sources and details. Thanks <img class="emoji" src="img/emoji-clap.png" alt="Emoji of hands clapping">'
  },
];

function stringRepeat(text, number) {
  var repeatedText = '';
  
  for (var i = 0; i < number; i++) {
    repeatedText += text;
  }
  
  return repeatedText;
}

function typingText() {
  var fundingTyping = current.funder + ((current.funder === allFunders) ? ' are typing...' : ' is typing...');
  var publicTyping = 'The public are typing...';
  var whatsUpTyping = 'What\'s Up? is typing...';
  var text = '';
  
  if (bubble < chat.length - 1) {
    if (chat[bubble + 1].hasOwnProperty('grant')) {
      text = fundingTyping;
    } else if (chat[bubble + 1].hasOwnProperty('popularity')) {
      text = publicTyping;
    } else if (chat[bubble + 1].hasOwnProperty('about')) {
      text = whatsUpTyping;
    }
  }
  
  return text;
}

function addBubble(bubbleData) {
  var speechBubble = '';
  var yearDivider = '';
  var popularityEmojis = '';
  var grantEmojis = '';
  
  if (bubbleData.hasOwnProperty('yearDivider')) {
    yearDivider = yearHtml;
    yearDivider = yearDivider.replace('[year]', bubbleData.year);
    $('#chat-holder').append(yearDivider);
  } else if (bubbleData.hasOwnProperty('popularity')) {
    speechBubble = speechBubbleHtml.right;
    popularityEmojis = bubbleData.popularity > 0 ? stringRepeat(talking.yes, bubbleData.popularity) : talking.no;
    speechBubble = speechBubble.replace('[text]', popularityEmojis);
    speechBubble = speechBubble.replace('[classes]', '');
  } else if (bubbleData.hasOwnProperty('grant')) {
    speechBubble = speechBubbleHtml.left;
    grantEmojis = bubbleData.grant > 0 ? stringRepeat(money.yes, bubbleData.grant) : money.no;
    speechBubble = speechBubble.replace('[text]', grantEmojis);
    speechBubble = speechBubble.replace('[classes]', '');
  } else if (bubbleData.hasOwnProperty('about')) {
    speechBubble = speechBubbleHtml.right;
    speechBubble = speechBubble.replace('[text]', bubbleData.about);
    speechBubble = speechBubble.replace('[classes]', 'speech-bubble-about');
  }
  
  $('#typing').text(typingText());
  
  if (speechBubble !== '') {
    $('#chat-holder').append(speechBubble); 
  }
  
  $('#chat-holder').scrollTop($('#chat-holder')[0].scrollHeight);
}

function nextBubble() {
  if (bubble < chat.length) {
    addBubble(chat[bubble]);
    bubble += 1;
    intervalTimer = setTimeout(nextBubble, bubbleTiming());
  } else {
    clearTimeout(intervalTimer);
  }
}

function bubbleTiming() {
  var timing = (bubble < chat.length && chat[bubble].hasOwnProperty('pause')) ? chat[bubble].pause : bubbleDelay[current.theme];
  
  return timing;
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
  
  if (current.theme === 'about') {
    addBubble(chat[bubble]);
    bubble = 1;
  }
  
  intervalTimer = setTimeout(nextBubble, bubbleTiming());
}

function getChatData() {
  var grants;
  var funderAverageGrant;
  var funderBiggestGrant;
  var yearGrant = {};
  var yearPopularity = {};
  var yearDivider = {};
  var pause = {
    'pause': bubbleDelay.pause
  };
  
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
      yearDivider = {
        year: i,
        yearDivider: 'yearDivider'
      }

      chat.push(yearDivider);

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

      chat.push(pause);
      chat.push(yearPopularity);
      chat.push(pause);
      chat.push(yearGrant);
    }
  }
}
