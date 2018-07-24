chat = [];
bubble = 0;
bubbleDelay = 1500;
intervalTimer = null;

speechBubbleHtml = {
  left: '<div class="pl-4"><div class="speech-bubble speech-bubble-left">[text]</div></div>',
  right: '<div class="text-right pr-4"><div class="speech-bubble speech-bubble-right">[text]</div></div>'
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
    
    $('#typing').text(current.funder + ((current.funder === allFunders) ? ' are typing...' : ' is typing...'));
  } else if (bubbleData.hasOwnProperty('grant')) {
    speechBubble = speechBubbleHtml.left;
    grantEmojis = bubbleData.grant > 0 ? money.yes.repeat(bubbleData.grant) : money.no;
    speechBubble = speechBubble.replace('[text]', grantEmojis);
    
    $('#typing').text('');
  }
  
  $('#chat-holder').append(speechBubble);
  $('#chat-holder').scrollTop($('#chat-holder')[0].scrollHeight);
}

function destroyChat() {
  clearInterval(intervalTimer);
  chat = [];
  bubble = 0;
  $('#chat').find('.year').remove();
  $('#chat').find('.speech-bubble').remove();
}

function showChat() {  
  $('#chat-funder').text(current.funder);
  $('#chat-image-funder').attr('src', 'img/funders/' + current.funder + '.jpg');
  $('#chat-theme').text(themes[current.theme]);
  $('#chat-image-theme').attr('src', 'img/themes/' + current.theme + '.jpg');
  
  getChatData();
  
  intervalTimer = setInterval(function() {
    if (bubble < chat.length) {
      addBubble(chat[bubble]);
      bubble += 1;
    } else {
      clearInterval(intervalTimer);
    }
  }, bubbleDelay);
}

function getChatData() {
  var grants;
  var funderBiggestGrant;
  var yearGrant = {};
  var yearPopularity = {};
  var pause = {};
  
  for (var i = startYear; i <= endYear; i++) {
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
        funderBiggestGrant = funders[j].biggestGrant;
      }
    }
    
    for (j = 0; j < grants.length; j++) {
      if (grants[j].org === current.funder) {
        yearGrant.grant = Math.ceil(grants[j].amount / funderBiggestGrant * 5);
      }
    }
    
    yearPopularity.popularity = Math.ceil(data[current.theme].popularity[i] / 20);
    
    chat.push(yearPopularity);
    chat.push(yearGrant);
  }
}
