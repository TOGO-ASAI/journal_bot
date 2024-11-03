dayjs.dayjs.locale("ja");

function sendMessage(userId, messageText) {
  let messageContent = {
    to: userId,
    messages: [
      {
        type: "text",
        text: messageText,
      },
    ],
  };
  let options = {
    method: "post",
    headers: HEADERS,
    payload: JSON.stringify(messageContent),
  };

  try {
    UrlFetchApp.fetch(PUSH_URL, options);
  } catch (e) {
    const newRow = LOG_SHEET.getLastRow() + 1;
    LOG_SHEET.getRange(newRow, 1).setValue(
      `${arguments.callee.name} error: ${e.message}`
    );
  }
}

function getVerse(currentIndex, language) {
  const sheet = SPREAD_SHEET.getSheetByName(language);
  const nextIndex = currentIndex + 1;
  const verseReference = sheet.getRange(nextIndex, VERSE_REF_COL).getValue();
  const verseText = sheet.getRange(nextIndex, VERSE_TEXT_COL).getValue();
  const responseText = `"${verseText}"\n${verseReference}`;
  return responseText;
}

function searchUserRow(userId) {
  const lastRow = MASTER_SHEET.getLastRow();
  if (lastRow == 1) {
    return null;
  }
  const savedUserIds = MASTER_SHEET.getRange(
    2,
    USER_ID_COL,
    lastRow - 1,
    1
  ).getValues();
  const userIndex = savedUserIds.findIndex(
    (savedUserId) => savedUserId[0] === userId
  );
  if (userIndex === -1) {
    return null;
  }
  const userRow = userIndex + 2;
  return userRow;
}

function journalProcess(userRow) {
  const userLanguage = MASTER_SHEET.getRange(userRow, LANGUAGE_COL).getValue();
  const updated_at = dayjs.dayjs(
    MASTER_SHEET.getRange(userRow, UPDATED_AT_COL).getValue()
  );
  const currentIndex = MASTER_SHEET.getRange(
    userRow,
    CURRENT_INDEX_COL
  ).getValue();
  const isActive = MASTER_SHEET.getRange(userRow, IS_ACTIVE_COL).getValue();
  const currentTime = dayjs.dayjs();
  if (
    updated_at.startOf("day").isSame(currentTime.startOf("day")) ||
    !updated_at
  ) {
    return wordlist(userLanguage)["already_done"];
  } else {
    if (currentIndex <= 40) {
      MASTER_SHEET.getRange(userRow, UPDATED_AT_COL).setValue(
        currentTime.format("YYYY/MM/DD HH:mm:ss")
      );
      MASTER_SHEET.getRange(userRow, CURRENT_INDEX_COL).setValue(
        currentIndex + 1
      );
      const verseMessage = getVerse(currentIndex, userLanguage);
      return verseMessage;
    } else if (currentIndex > 40 && isActive === 1) {
      MASTER_SHEET.getRange(userRow, IS_ACTIVE_COL).setValue(0);
      const congratsMessage = wordlist(userLanguage)["congrats_message"];
      return congratsMessage;
    } else {
      return "finished";
    }
  }
}

function newUserRegister(userId) {
  //新規登録時のデフォルト設定
  const newUserRowData = [
    [
      userId,
      1,
      0,
      "21:00",
      "Japanese",
      dayjs.dayjs().format("YYYY/MM/DD HH:mm:ss"),
      "",
    ],
  ];
  const newRow = MASTER_SHEET.getLastRow() + 1;
  const lastCol = MASTER_SHEET.getLastColumn();
  const userRow = searchUserRow(userId);
  if (userRow === null) {
    MASTER_SHEET.getRange(newRow, 1, 1, lastCol).setValues(newUserRowData);
  } else {
    MASTER_SHEET.getRange(userRow, 1, 1, lastCol).setValues(newUserRowData);
  }
}

function languageSwitch(userRow, userLanguage) {
  let languageToSet = "";
  let responseMessage = "";
  if (userLanguage === "Japanese") {
    languageToSet = "English";
    responseMessage = wordlist("English")["language_switched"];
  } else if (userLanguage === "English") {
    languageToSet = "Japanese";
    responseMessage = wordlist("Japanese")["language_switched"];
  }
  MASTER_SHEET.getRange(userRow, LANGUAGE_COL).setValue(languageToSet);
  return responseMessage;
}

function getActiveUsers() {
  const lastRow = MASTER_SHEET.getLastRow();
  const lastCol = MASTER_SHEET.getLastColumn();
  const savedUsers = MASTER_SHEET.getRange(
    2,
    USER_ID_COL,
    lastRow - 1,
    lastCol
  ).getValues();
  const activeUsers = savedUsers.filter((savedUser) => savedUser[1] == 1);
  return activeUsers;
}
