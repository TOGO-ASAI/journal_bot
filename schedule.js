function sendJournal(user) {
  let userId = user[USER_ID_COL - 1];
  let userRow = searchUserRow(userId);
  const journalResponse = journalProcess(userRow);
  sendMessage(userId, journalResponse);
}

function doGet() {
  const currentTime = dayjs.dayjs().format("HH:mm");
  const activeUsers = getActiveUsers();
  const scheduledUsers = activeUsers.filter(
    (activeUser) =>
      dayjs.dayjs(activeUser[JOURNAL_TIME_COL - 1]).format("HH:mm") ===
      currentTime
  );
  if (scheduledUsers) {
    for (users of scheduledUsers) {
      sendJournal(users);
    }
  }
  const data = {
    message: "Function executed successfully!",
    status: "success",
    timestamp: new Date().toISOString(),
  };
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
