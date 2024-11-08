const API_KEY = getAPI();
const REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const PUSH_URL = "https://api.line.me/v2/bot/message/push";
const SPREAD_SHEET_ID = getSpreadSheetId();
const SPREAD_SHEET = SpreadsheetApp.openById(SPREAD_SHEET_ID);
const LOG_SHEET = SPREAD_SHEET.getSheetByName("Log");
const MASTER_SHEET = SPREAD_SHEET.getSheetByName("Master Data");
const USER_ID_COL = 1;
const IS_ACTIVE_COL = 2;
const CURRENT_INDEX_COL = 3;
const JOURNAL_TIME_COL = 4;
const LANGUAGE_COL = 5;
const STARTED_AT_COL = 6;
const UPDATED_AT_COL = 7;
const JPN_SHEET = SPREAD_SHEET.getSheetByName("Japanese");
const ENG_SHEET = SPREAD_SHEET.getSheetByName("English");
const VERSE_REF_COL = 1;
const VERSE_TEXT_COL = 2;
const TODAY = dayjs.dayjs().format("YYYY/MM/DD");
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};

function getAPI() {
  return PropertiesService.getScriptProperties().getProperty("API_KEY");
}

function getSpreadSheetId() {
  return PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID");
}

dayjs.dayjs.locale("ja");
