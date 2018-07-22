columnWidth = null;
current = {
  column: 'themes',
  theme: null,
  funder: null
};
choiceHtml = '<div data-choice="[data-choice]" class="choice row"><div class="col-3 choice-image align-top"><img src="[image-src]"></div><div class="col-7 choice-text align-top"><div class="choice-title">[choice-title]</div><div class="choice-description">[choice-description]</div></div><img class="col-2 choice-arrow align-top" src="img/arrow-right.svg" alt="[arrow-alt]"></div>';

function sizeColumns() {
  columnWidth = $('#main-holder').width();
  $('#swiping-holder').width(columnWidth * 3);
  $('.swiping-column').width(columnWidth);
  $('.swiping-column').show();
}

function addChoices() {
  var funderHtml = '';
  var fundersHtml = '';
  var themeHtml = '';
  var themesHtml = '';
  
  for (var i = 0; i < funders.length; i++) {
    funderHtml = choiceHtml;
    funderHtml = funderHtml.replace('[data-choice]', funders[i]);
    funderHtml = funderHtml.replace('[image-src]', 'img/funders/' + funders[i] + '.png');
    funderHtml = funderHtml.replace('[choice-title]', funders[i]);
    funderHtml = funderHtml.replace('[choice-description]', '');
    funderHtml = funderHtml.replace('[arrow-alt]', funders[i]);
    
    fundersHtml += funderHtml;
  }
  
  for (var theme in themes) {
    themeHtml = choiceHtml;
    themeHtml = themeHtml.replace('[data-choice]', theme);
    themeHtml = themeHtml.replace('[image-src]', 'img/themes/' + themes[theme] + '.png');
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
        current.column = 'funders';
        
        $('#choices-funders').scrollTop(0);
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
        }, 500);
        
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
        current.funder = null;
        current.column = 'funders';
        
        $('#swiping-holder').animate({
          left: - columnWidth
        }, 500);
        break;
    }
  });
}

$(document).ready(function() {
  sizeColumns();
});

$(window).resize(function() {
  sizeColumns();
});
  