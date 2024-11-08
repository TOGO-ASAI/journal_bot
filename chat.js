function doPost(e) {
  let json = e.postData.contents;
  let events = JSON.parse(json).events;
  const userId = events[0]["source"]["userId"];
  try {
    events.forEach(function (event) {
      if (event.type === "message" && event.message.type === "text") {
        const inputMessage = event.message.text;
        const userRow = searchUserRow(userId);
        const userLanguage = MASTER_SHEET.getRange(
          userRow,
          LANGUAGE_COL
        ).getValue();
        let messageToReply = {};
        const timeRegex = /^([01]\d|2[0-3]):(00|30)$/;
        if (timeRegex.test(inputMessage)) {
          MASTER_SHEET.getRange(userRow, JOURNAL_TIME_COL).setValue(
            inputMessage
          );
          const messageText = wordlist(userLanguage)["set_journal_time"];
          messageToReply = {
            replyToken: event.replyToken,
            messages: [{ type: "text", text: messageText }],
          };
        } else {
          switch (inputMessage) {
            case "journaling":
            case "Journaling":
            case "journal":
            case "Journal":
            case "じゃーなる":
            case "ジャーナル":
              const journalResponse = journalProcess(userRow);
              if (journalResponse !== "finished") {
                messageToReply = {
                  replyToken: event.replyToken,
                  messages: [{ type: "text", text: journalResponse }],
                };
              }
              break;
            case "Switch Language":
            case "言語切替":
              const langSwitchedMessage = languageSwitch(userRow, userLanguage);
              messageToReply = {
                replyToken: event.replyToken,
                messages: [{ type: "text", text: langSwitchedMessage }],
              };
              break;
            case "Change Time":
              const messageText = wordlist(userLanguage)["change_time_reply"];
              messageToReply = {
                replyToken: event.replyToken,
                messages: [{ type: "text", text: messageText }],
              };
              break;
            default:
              return;
          }
        }
        if (!messageToReply || Object.keys(messageToReply).length === 0) {
          return;
        }
        let options = {
          method: "post",
          headers: HEADERS,
          payload: JSON.stringify(messageToReply),
        };
        try {
          UrlFetchApp.fetch(REPLY_URL, options);
        } catch (error) {
          console.error("Error in UrlFetchApp.fetch:", error.message);
        }
      } else if (event.type === "follow") {
        newUserRegister(userId);
      } else if (event.type === "unfollow") {
        let newRow = LOG_SHEET.getLastRow() + 1;
        LOG_SHEET.getRange(newRow, 1).setValue(userId + " unfollowed.");
      }
    });
    const newRow = LOG_SHEET.getLastRow() + 1;
    LOG_SHEET.getRange(newRow, 1).setValue(events[0]);
  } catch (error) {
    const newRow = LOG_SHEET.getLastRow() + 1;
    LOG_SHEET.getRange(newRow, 1).setValue(
      "Error: " + error.message + "\nStack: " + error.stack
    );
  } finally {
    return ContentService.createTextOutput("OK").setMimeType(
      ContentService.MimeType.TEXT
    );
  }
}
