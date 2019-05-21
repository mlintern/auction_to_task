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
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + month + "-" + day ;
  var hour = ('0' + (now.getHours() + 1)).slice(-2);
  var min = ('0' + (now.getMinutes() + 1)).slice(-2);

  $('.auction-date').val(today);
  $('.auction-time').val(hour + ':' + min);
});

function createTask(id, bid, timestamp) {
  var now = new Date();
  var year = now.getFullYear();
  var day = ('0' + now.getDate()).slice(-2);
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  var hour = ('0' + now.getHours()).slice(-2);
  var min = ('0' + now.getMinutes()).slice(-2);
  var sec = ('0' + now.getSeconds()).slice(-2);

  var currentTime = year + "-" + month + "-" + day + 'T' + hour + ':' + min + ':' + sec + '.' + now.getMilliseconds();
  // '2019-5-20T12:00:00-08:00';

  var command = 'ruby file.rb ' + id + ' ' + bid + ' x y';
  console.log(timestamp);

  return [
    '<?xml version="1.0" encoding="UTF-16"?>',
    '<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">',
    '  <RegistrationInfo>',
    '    <Date>' + currentTime + '</Date>',
    '    <Author>DESKTOP-GPH8FUF\\FBA laptop</Author>',
    '    <Description>' + id + ' Bid on Auction</Description>',
    '    <URI>\\' + id + ' Bid on Auction</URI>',
    '  </RegistrationInfo>',
    '  <Triggers>',
    '    <TimeTrigger>',
    '      <StartBoundary>' + timestamp + '</StartBoundary>',
    '      <Enabled>true</Enabled>',
    '    </TimeTrigger>',
    '  </Triggers>',
    '  <Principals>',
    '    <Principal id="Author">',
    '      <UserId>S-1-5-21-1770539047-2666447036-182095672-1001</UserId>',
    '      <LogonType>InteractiveToken</LogonType>',
    '      <RunLevel>LeastPrivilege</RunLevel>',
    '    </Principal>',
    '  </Principals>',
    '  <Settings>',
    '    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>',
    '    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>',
    '    <StopIfGoingOnBatteries>true</StopIfGoingOnBatteries>',
    '    <AllowHardTerminate>true</AllowHardTerminate>',
    '    <StartWhenAvailable>false</StartWhenAvailable>',
    '    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>',
    '    <IdleSettings>',
    '      <StopOnIdleEnd>true</StopOnIdleEnd>',
    '      <RestartOnIdle>false</RestartOnIdle>',
    '    </IdleSettings>',
    '    <AllowStartOnDemand>true</AllowStartOnDemand>',
    '    <Enabled>true</Enabled>',
    '    <Hidden>false</Hidden>',
    '    <RunOnlyIfIdle>false</RunOnlyIfIdle>',
    '    <WakeToRun>false</WakeToRun>',
    '    <ExecutionTimeLimit>PT72H</ExecutionTimeLimit>',
    '    <Priority>7</Priority>',
    '  </Settings>',
    '  <Actions Context="Author">',
    '    <Exec>',
    '      <Command>C:\\Ruby26-x64\\bin\\ruby.exe</Command>',
    '      <Arguments>auction_bidder.rb ' + id + ' ' + bid + ' x y</Arguments>',
    '      <WorkingDirectory>C:\\mark\\auction_bidder</WorkingDirectory>',
    '    </Exec>',
    '  </Actions>',
    '</Task>'
  ].join('\n');
}

$('.auction-to-task-form').on('submit', function (event) {
  event.preventDefault()

  var id = $('.auction-id').val();
  var bid = $('.auction-bid').val();
  var timestamp = $('.auction-date').val() + 'T' + $('.auction-time').val() + ':00';

  var doc = createTask(id, bid, timestamp);

  var blob = new Blob([doc], {type: "text/plain"});
  var url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: id + '_bid_task' + '.xml'
  });
});
