columnWidth = null;
columnHeight = null;
current = {
  column: 'themes',
  theme: null,
  funder: null
};
choiceHtml = '<div data-choice="[data-choice]" class="choice row"><div class="col-3"><div class="choice-image align-top"><img src="[image-src]"></div></div><div class="col-7 choice-text"><div class="choice-title">[choice-title]</div></div><img class="col-2 choice-arrow align-top" src="img/arrow-right.svg" alt="[arrow-alt]"></div>';
dividerHtml = '<div class="divider"></div>';
description = 'Does funding lead or follow emerging issues?';

function sizeColumns() {
  columnWidth = $('#main-holder').width();
  $('#swiping-holder').width(columnWidth * 3);
  $('.swiping-column').width(columnWidth);
  columnHeight = $('#main-holder').outerHeight() - $('#title-bar').outerHeight();
  $('#swiping-holder').height(columnHeight);
  $('.swiping-column').height(columnHeight);
  $('#chat').height(columnHeight);
  $('#chat-holder').height(columnHeight - $('#chat-top').outerHeight() - 120);
}

function addChoices() {
  var funderHtml = '';
  var fundersHtml = '';
  var themeHtml = '';
  var themesHtml = '';
  
  for (var i = 0; i < funders.length; i++) {
    funderHtml = choiceHtml;
    funderHtml = funderHtml.replace('[data-choice]', funders[i].name);
    funderHtml = funderHtml.replace('[image-src]', 'img/funders/' + funders[i].name + '.jpg');
    funderHtml = funderHtml.replace('[choice-title]', funders[i].name);
    funderHtml = funderHtml.replace('[arrow-alt]', funders[i].name);
    
    if (i === 0) {
      funderHtml += dividerHtml;
    }
    
    fundersHtml += funderHtml;
  }
  
  themeHtml = choiceHtml;
  themeHtml = themeHtml.replace('[data-choice]', 'about');
  themeHtml = themeHtml.replace('[image-src]', 'img/themes/' + 'about.jpg');
  themeHtml = themeHtml.replace('[choice-title]', 'About');
  themeHtml = themeHtml.replace('[arrow-alt]', 'About');
  themeHtml += dividerHtml;
  themesHtml += themeHtml;
  
  for (var theme in themes) {
    themeHtml = choiceHtml;
    themeHtml = themeHtml.replace('[data-choice]', theme);
    themeHtml = themeHtml.replace('[image-src]', 'img/themes/' + theme + '.jpg');
    themeHtml = themeHtml.replace('[choice-title]', themes[theme]);
    themeHtml = themeHtml.replace('[choice-description]', '');
    themeHtml = themeHtml.replace('[arrow-alt]', themes[theme]);
    
    themesHtml += themeHtml;
  }
  
  $('#choices-funders').append(fundersHtml);
  $('#choices-themes').append(themesHtml);
  
  $('.choice').on('click', function () {
    switch (current.column) {
      case 'themes':
        current.theme = $(this).attr('data-choice');
        
        if (current.theme === 'about') {
          current.column = 'chat';
        
          $('#choices-funders').hide();
          $('#chat-image-funder').parent().hide();
          $('#typing').text('What\'s Up? is typing');
          
          showChat();
        } else {
          current.column = 'funders';
          $('#choices-funders').scrollTop(0);
        }
        
        $('#swiping-holder').animate({
          left: - columnWidth
        }, 500);
        $('#back').css('visibility', 'visible');
        break;
        
      case 'funders':
        current.funder = $(this).attr('data-choice');
        current.column = 'chat';
        
        $('#swiping-holder').animate({
          left: - (columnWidth * 2)
        }, 500, function() {
          $('#typing').text('');
          showChat();
        });
        
        $('#back').css('visibility', 'visible');
        break;
    }
  });
  
  $('#back').on('click', function () {
    switch (current.column) {
      case 'funders':
        current.theme = null;
        current.column = 'themes';
        
        $('#swiping-holder').animate({
          left: 0
        }, 500);
        
        $('#back').css('visibility', 'hidden');
        break;
        
      case 'chat':
        stopChat();
        
        if (current.theme === 'about') {
          current.theme = null;
          current.column = 'themes';
          
          $('#swiping-holder').animate({
            left: 0
          }, 500, function() {
            $('#choices-funders').show();
            $('#chat-image-funder').parent().show();
            destroyChat();
          });
          
          $('#back').css('visibility', 'hidden');
        } else {
          current.funder = null;
          current.column = 'funders';
          
          $('#swiping-holder').animate({
            left: - columnWidth
          }, 500, function() {
            destroyChat();
          });
        }
        break;
    }
    
    $('#typing').text(description);
  });
}

$(document).ready(function() {
  $('#typing').text(description);
  sizeColumns();
});

$(window).resize(function() {
  sizeColumns();
});

window.addEventListener('orientationchange', function() {
  sizeColumns();
}, false);
  