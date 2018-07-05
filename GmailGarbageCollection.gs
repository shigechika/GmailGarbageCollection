// Gmail Garbage Collection

// Action	Gmail search operator
// Archive	"older_than:7d category:social from:facebookmail.com" -is:important
// Trash 	"older_than:1m category:social from:facebookmail.com" -is:important
// Trash 	"older_than:7d category:social from:twitter.com" -is:important
// Archive 	"older_than:1m category:social from:twitter.com" -is:important
// Trash 	"older_than:7d category:social from:@plus.google.com" -is:important
// Archive 	"older_than:1m category:social from:@plus.google.com" -is:important
// Archive	older_than:7d category:promotions "本日最終日" OR "本日限定" OR "本日迄" OR "本日まで" -is:important
// Trash 	older_than:1m category:promotions "本日最終日" OR "本日限定" OR "本日迄" OR "本日まで" -is:important
// Archive	older_than:1m (category:promotions OR category:social) -is:important
// Trash	older_than:2m (category:promotions OR category:social) -is:important
// Trash	"older_than:1y to:root@" -is:important

function GmailGarbageCollection(){
  //タイマーで起動するのでgetActiveSheet()などは使えない
  //var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startTime = new Date();
  var sheet = SpreadsheetApp.openById("1W3lfUaF_9msFJ2oRETpKMTvbF_xxxxxxxxxxxxx").getSheetByName("シート1");
  var properties = PropertiesService.getScriptProperties();  //途中経過保存用
  var startRowKey = "startRow";  //何行目まで処理したかを保存するときに使用するkey
  var triggerKey = "trigger";    //トリガーIDを保存するときに使用するkey

  //途中から実行した場合、ここに何行目まで実行したかが入る
  var startRow = parseInt(properties.getProperty(startRowKey));
  if(!startRow){
    //初めて実行する場合はこっち
    startRow = 2;
  }

  var start = 0;
  var max = 100;

  var lastRow = sheet.getLastRow();
  Logger.log("lastRow:" + lastRow);

  for ( var r = startRow; r <= lastRow ; r++ ) {

    var diff = parseInt((new Date() - startTime) / (1000 * 60));
    if(diff >= 5){
      //5分経過していたら処理を中断
      properties.setProperty(startRowKey, r);  //何行まで処理したかを保存
      setTrigger(triggerKey, "GmailGarbageCollection");          //トリガーを発行
      return 2;
    }

    var action = sheet.getRange(r, 1).getValue();
    Logger.log("action:" + action);
    var search =  sheet.getRange(r, 2).getValue();
    Logger.log("search:" + search);
    var threads = GmailApp.search(search, start, max);
    Logger.log("threads.length:" + threads.length);
    
    if ( ! threads.length ) {
      continue; // not found
    }

    switch (action) {
    case "Archive":
      GmailApp.moveThreadsToArchive(threads);
      break;
    case "Trash":
      GmailApp.moveThreadsToTrash(threads);
      break;
    case "Inbox":
      GmailApp.moveThreadsToInbox(threads);
      break;
    case "Spam":
      GmailApp.moveThreadsToSpam(threads);
      break;
    default:
      return 1;
    }
 }

  //全て実行終えたらトリガーと何行目まで実行したかを削除する
  deleteTrigger(triggerKey);
  properties.deleteProperty(startRowKey);

  return 0;
}

//指定したkeyに保存されているトリガーIDを使って、トリガーを削除する
function deleteTrigger(triggerKey) {
  var triggerId = PropertiesService.getScriptProperties().getProperty(triggerKey);
  
  if(!triggerId) return;
  
  ScriptApp.getProjectTriggers().filter(function(trigger){
    return trigger.getUniqueId() == triggerId;
  })
  .forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  PropertiesService.getScriptProperties().deleteProperty(triggerKey);
}
 
//トリガーを発行
function setTrigger(triggerKey, funcName){
  deleteTrigger(triggerKey);   //保存しているトリガーがあったら削除
  var dt = new Date();
  dt.setMinutes(dt.getMinutes() + 1);  //１分後に再実行
  var triggerId = ScriptApp.newTrigger(funcName).timeBased().at(dt).create().getUniqueId();
  //あとでトリガーを削除するためにトリガーIDを保存しておく
  PropertiesService.getScriptProperties().setProperty(triggerKey, triggerId);
}
