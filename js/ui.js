columnWidth = null;
currentColumn = 'funders';

function sizeColumns() {
  columnWidth = $('#main-holder').width();
  $('#swiping-holder').width(columnWidth * 3);
  $('.swiping-column').width(columnWidth);
  $('.swiping-column').show();
}

$(document).ready(function() {
  sizeColumns();
});

$(window).resize(function() {
  sizeColumns();
});
  