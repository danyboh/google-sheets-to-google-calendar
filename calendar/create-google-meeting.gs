

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

  const range = e.range;
  const row = range.getRow();
  const col = range.getColumn();
  const currentColumn = columnToLetter(col).toLowerCase();
  const columnFromConfig = mainSettings.checkboxCol.toLowerCase();

  if (currentColumn === columnFromConfig && e.value === 'TRUE') {
    const data = createEventData(row);
    googleEvent(data);
  }
}

function googleEvent(data) {
  if (!calendar) {
    calendar = CalendarApp.getCalendarById(mainSettings.calendarId);
  }

  if (data.payload.eventId) {
    updateEvent(data);
  } else {
    createEvent(data);
  }
}

function createEvent(data) {
  const {eventId, name, details, date} = data.payload;
  const event = calendar.createEvent(name, date, date, {
    // guests: 'ksyuzozu@gmail.com',
    description: details
  });

  event.addPopupReminder(10);

  const eventIdScope = event.getId();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(data.params.row, data.params.eventIdCol).setValue(eventIdScope);

  showSuccess('✅ Подію успішно створено');
}

function updateEvent(data) {
  const {eventId, name, details, date} = data.payload;
  const event = calendar.getEventById(eventId);
  if (!event) {
    createEvent(data);
  } else {
    event.setTime(date, date);
    event.setTitle(name);
    event.setDescription(details);
    showSuccess('✅ Подію успішно змінено');
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
      .createMenu('⚙️ Подія з таблиці')
      .addItem('Налаштування', 'showSettingsSidebar')
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
      .setTitle('Налаштування плагіну');
  SpreadsheetApp.getUi().showSidebar(html);
}

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
