// Gmail Garbage Collection

// Action	Gmail search operator
// Archive	"older_than:7d category:social from:facebookmail.com"
// Trash 	"older_than:1m category:social from:facebookmail.com"
// Trash 	"older_than:7d category:social from:twitter.com"
// Archive 	"older_than:1m category:social from:twitter.com"
// Trash 	"older_than:7d category:social from:@plus.google.com"
// Archive 	"older_than:1m category:social from:@plus.google.com"
// Archive	older_than:7d category:promotions "本日最終日" OR "本日限定" OR "本日迄" OR "本日まで"
// Trash 	older_than:1m category:promotions "本日最終日" OR "本日限定" OR "本日迄" OR "本日まで"
// Archive	older_than:1m (category:promotions OR category:social) 
// Trash	older_than:2m (category:promotions OR category:social) 
// Trash	"older_than:1y to:root@"

function GmailGarbageCollection(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var start = 0;
  var max = 100;

  // This logs the value in the very last cell of this sheet
  var lastRow = sheet.getLastRow();
  Logger.log("lastRow:" + lastRow);

  for ( var r = 2; r <= lastRow ; r++ ) {
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
 return 0;
}
