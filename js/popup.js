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
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

  $('.auction-date').val(today);
  $('.auction-time').val(now.getHours() + ':' + now.getMinutes());
});

function createTask(id, bid, timestamp) {
  var now = '2019-5-20T12:00:00-08:00';
  var command = 'ruby file.rb ' + id + ' ' + bid + ' x y';
  return [
    '<?xml version="1.0" ?>',
    '<Task xmlns="https://schemas.microsoft.com/windows/2004/02/mit/task">',
        '<RegistrationInfo>',
            '<Date>',
            now,
            '</Date>',
            '<Author>Nretnil</Author>',
            '<Version>1.0.0</Version>',
            '<Description>Make a Bid at a Specific Time</Description>',
        '</RegistrationInfo>',
        '<Triggers>',
            '<TimeTrigger>',
                '<StartBoundary>2005-10-11T13:21:17-08:00</StartBoundary>',
                '<EndBoundary>2006-01-01T00:00:00-08:00</EndBoundary>',
                '<Enabled>true</Enabled>',
                '<ExecutionTimeLimit>PT5M</ExecutionTimeLimit>',
            '</TimeTrigger>',
        '</Triggers>',
        '<Principals>',
            '<Principal>',
                '<UserId>Administrator</UserId>',
                '<LogonType>InteractiveToken</LogonType>',
            '</Principal>',
        '</Principals>',
        '<Settings>',
            '<Enabled>true</Enabled>',
            '<AllowStartOnDemand>true</AllowStartOnDemand>',
            '<AllowHardTerminate>true</AllowHardTerminate>',
        '</Settings>',
        '<Actions>',
            '<Exec>',
                '<Command>',
                command,
                '</Command>',
            '</Exec>',
        '</Actions>',
    '</Task>',
  ].join('\n');
}

$('.auction-to-task-form').on('submit', function (event) {
  event.preventDefault()

  var id = $('.auction-id').val();
  var bid = $('.auction-bid').val();
  var timestamp = $('.auction-date').val() + $('.auction-time').val();
  var doc = createTask(id, bid, timestamp);

  var blob = new Blob([doc], {type: "text/plain"});
  var url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: 'task_' + id + '.xml'
  });
});
