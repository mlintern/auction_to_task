console.log("popup.js");

function getUrlVars(url) {
  var vars = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { vars[key] = value.replace(/%20/g, ' '); });
  return vars;
}

function paramExists(url,p){
  return url.search("[?&]" + p + "=") != -1;
}

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  var url =  tabs[0].url;

  console.log(url);

  var vars = getUrlVars(url);

  if ( vars['auctionId'] !== undefined ) {
    console.log(vars['auctionId']);
    $('.auction-id').val(vars['auctionId']);
  }

  if ( vars['auctionBid'] !== undefined ) {
    console.log(vars['auctionBid']);
    $('.auction-bid').val(vars['auctionBid']);
  }
});

$('.auction-to-task-form').on('submit', function (event) {
  event.preventDefault()
  console.log("Create and Download XML Doc.")
});
