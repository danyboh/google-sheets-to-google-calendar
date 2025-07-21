

let mainSettings = null;
let calendar = null;

function columnToLetter(column) {
  let temp = '';
  while (column > 0) {
    const remainder = (column - 1) % 26;
    temp = String.fromCharCode(65 + remainder) + temp;
    column = Math.floor((column - 1) / 26);
  }
  return temp;
}

function letterToColumn(letter) {
  let column = 0;
  for (let i = 0; i < letter.length; i++) {
    column *= 26;
    column += letter.charCodeAt(i) - 64; // A = 1
  }
  return column;
}

function onEditSavingEvent(e) {
  if (!mainSettings) {
    mainSettings = getSettings();
  };

  if (!calendar) {
    calendar = CalendarApp.getCalendarById(mainSettings.calendarId);
  }
  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();
  const currentColumn = columnToLetter(col).toLowerCase();
  const columnFromConfig = mainSettings.checkboxCol.toLowerCase();

  if (currentColumn === columnFromConfig && e.value === 'TRUE') {
    showSuccess('this is right column');
    const data = createEventData(row);
    googleEvent(data);
  }
}

function googleEvent(data) {
  // it is not going to create event for some reason
  if (data.payload.eventId) {
    updateEvent(data);
  } else {
    showSuccess('it is on create event');
    createEvent(data);
  }
}

function createEvent(data) {
  const {eventId, name, details, date} = data.payload;
  const event = calendar.createEvent(name, date, date, {
    // guests: 'ksyuzozu@gmail.com',
    description: details
  });

  const eventIdScope = event.getId();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(data.params.row, data.params.eventIdCol).setValue(eventIdScope);
}

function updateEvent(data) {
  const event = calendar.getEventById(eventId);
  const {eventId, name, details, date} = data;
  if (!event) {
    createEvent(data);
  } else {
    console.log('updateevent');
    const now = new Date();
    const dateAt17 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    // event.setTime(dateAt17, dateAt17);
    // event.setTitle(name);
    // event.setDescription(details);
  }
}

function createEventData(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const nameCol = letterToColumn(mainSettings.eventNameCol);
  const detailsCol = letterToColumn(mainSettings.eventDetailsCol);
  const dateCol = letterToColumn(mainSettings.eventDateCol);
  const eventIdCol = letterToColumn(mainSettings.eventIdCol);
  const name = sheet.getRange(row, nameCol).getValue();
  const details = sheet.getRange(row, detailsCol).getValue();
  const date = sheet.getRange(row, dateCol).getValue();
  const eventId = sheet.getRange(row, eventIdCol).getValue();
  return {
    payload: {
      name,
      details,
      date,
      eventId
    },
    params: {
      row,
      eventIdCol
    }

  };
}

function onOpenWithCalendar() {
  mainSettings = getSettings();
  SpreadsheetApp.getUi()
      .createMenu('⚙️ Sheets to Calendar')
      .addItem('Settings', 'showSettingsSidebar')
      .addToUi();
}

function saveSettings(config) {
  mainSettings = config;
  const jsonConfig = JSON.stringify(config);
  PropertiesService.getDocumentProperties().setProperty('mainConfig', jsonConfig);
}

function getSettings() {
  const json = PropertiesService.getDocumentProperties().getProperty('mainConfig');
  if (!json) {
    return null;
  }
  return JSON.parse(json);
}

function showSettingsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('settings')
      .setTitle('App Settings');
  SpreadsheetApp.getUi().showSidebar(html);
}

function insertDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange('K2');
  cell.setValue(new Date());
}

function insertCurrentColumn(col) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange('K3');
  cell.setValue(col);
}

function handleCheckboxChange(value) {
  console.log('insider the function!', value);

  if (value === 'TRUE') {
    insertDate();
    console.log('Checkbox checked!');
  }
}

const msg = '✅ Action completed successfully!';

function showError(text) {
  showNotification(text, 'Error');
}

function showSuccess(text) {
  showNotification(text, 'Success');
}

function showNotification(text, type) {
  SpreadsheetApp.getActiveSpreadsheet()
      .toast(text, type, 3);
}
