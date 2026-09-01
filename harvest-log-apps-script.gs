/**
 * ESG / NLT Post-Processing SOP — harvest log backend
 * ---------------------------------------------------
 * Receives the daily AM/PM ticks from ProcessingSOP.html and keeps one row
 * per harvest + date in a Google Sheet.
 *
 * SETUP (about five minutes, once)
 *  1. Use any Google Sheet — a new one, or an existing workbook. This script
 *     creates and writes ONE tab of its own (see SHEET_NAME below) and never
 *     touches your other tabs.
 *  2. Extensions → Apps Script. Delete the sample code, paste this whole file.
 *  2b. OPTIONAL CHECK: pick "setup" in the function dropdown at the top and hit
 *      Run. That creates the Log tab and gets the Google permission prompt out
 *      of the way. Do NOT run "myFunction" — that was the sample code you
 *      deleted, and the dropdown often still points at it.
 *  3. Save, then Deploy → New deployment → type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone            <-- required, the page calls it without a login
 *  3b. SET A CREW CODE: change ACCESS_CODE below from CHANGE-ME to whatever
 *      short code the crew will use (e.g. "esg2026"). Without the right code
 *      the web app returns nothing and accepts nothing, so the /exec URL being
 *      visible in the public page source is no longer enough to read or write
 *      the log. Tell the crew the code once; each phone stores it after that.
 *  4. Authorise when Google asks. Copy the Web app URL (it ends in /exec).
 *  5. Paste that URL into ProcessingSOP.html: find SHEET_ENDPOINT near the
 *     bottom of the file and put it between the quotes. Commit and push.
 *     (Or paste it into the yellow setup box on the page — that saves it for
 *      that one device only, which is handy for testing.)
 *
 * If you ever change this script, you must Deploy → Manage deployments →
 * edit → New version, or the page keeps hitting the old copy.
 *
 * "Anyone" is about Google's login check, not about your data — every request
 * still has to carry the crew code set in ACCESS_CODE below, or it is refused.
 */

// Shared crew code. CHANGE THIS before deploying, and give it to the crew.
// The SOP page is public, so this — not the URL — is what keeps the log private.
// To rotate it later: change it here, Deploy > Manage deployments > New version,
// and tell everyone the new code (their phones will ask again).
var ACCESS_CODE = 'CHANGE-ME';

// Tab this script owns. It is created on first use and nothing else is touched,
// so this is safe to add to a workbook that already has other tabs in it.
// Deliberately specific so it can't collide with a tab you already have.
var SHEET_NAME = 'SOP Harvest Log';

// Must stay in the same order as HEADERS below, and match the task ids in
// ProcessingSOP.html. If you add a check to the page, add it in both places
// (append it at the end so existing columns don't shift).
var TASK_IDS = [
  '2am-env', '2am-lids', '2am-tip', '2am-wait', '2am-close',
  '3am-env', '4am-env', '5am-env',
  '1pm-move', '1pm-full', '1pm-weigh',
  '2pm-lids', '2pm-shake', '2pm-close',
  '3pm-ready', '3pm-env',
  '4pm-grade', '4pm-pound', '4pm-light', '4pm-fold',
  '5pm-bags', '5pm-totes'
];
var FIRST_TASK_COL = 3;   // Facility, Harvest, Date come first

var HEADERS = [
  'Facility', 'Harvest', 'Date',
  /* --- morning --- */
  'AM 2 Cure room env', 'AM 2 Lids off', 'AM 2 Tip bins', 'AM 2 Lids off 15-20min', 'AM 2 Lids on',
  'AM 3 Machine room env', 'AM 4 Hand trim room env', 'AM 5 Storage env',
  /* --- end of day --- */
  'PM 1 Straight to trim room', 'PM 1 Full totes only', 'PM 1 Tote weights',
  'PM 2 Lids off', 'PM 2 Shake 10-15s', 'PM 2 Lids on',
  'PM 3 Cure ready (Rob)', 'PM 3 Machine room env',
  'PM 4 A grade pulled', 'PM 4 Pounded out', 'PM 4 Nothing uncovered', 'PM 4 Liner folded',
  'PM 5 Bags folded not tied', 'PM 5 Totes lidded dark',
  'AM by', 'PM by', 'Notes', 'Updated'
];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setColumnWidth(1, 90);   // Facility
    sh.setColumnWidth(2, 160);  // Harvest
    sh.setColumnWidth(HEADERS.length - 1, 260);  // Notes
  }
  return sh;
}

/**
 * The only function meant to be run by hand from the editor.
 * Creates the Log tab with its headers and triggers the authorisation prompt.
 * Safe to run more than once — it won't touch existing rows.
 */
function setup() {
  var sh = sheet_();
  var rows = Math.max(0, sh.getLastRow() - 1);
  var head = sh.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (String(head) !== String(HEADERS)) {
    var warn = 'STOP: the tab "' + SHEET_NAME + '" already exists with different headers. ' +
      'Rename that tab, or change SHEET_NAME at the top of this script, then run setup again.';
    Logger.log(warn);
    return warn;
  }
  var msg = 'Ready. Tab "' + SHEET_NAME + '" is set up with ' + rows + ' log row(s). ' +
    'Nothing else in this spreadsheet was touched.' +
    (ACCESS_CODE === 'CHANGE-ME' ? '  WARNING: ACCESS_CODE is still CHANGE-ME — set a real crew code before deploying.' : '');
  Logger.log(msg);
  return msg;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function dateStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v || '');
}

function readRows_() {
  var sh = sheet_();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.map(function (row, i) {
    var tasks = {};
    TASK_IDS.forEach(function (id, n) {
      var v = row[FIRST_TASK_COL + n];
      tasks[id] = v === true || v === 'TRUE';
    });
    var tail = FIRST_TASK_COL + TASK_IDS.length;
    return {
      rowIndex: i + 2,
      facility: String(row[0] || ''),
      harvest: String(row[1] || ''),
      date: dateStr_(row[2]),
      tasks: tasks,
      amBy: String(row[tail] || ''),
      pmBy: String(row[tail + 1] || ''),
      note: String(row[tail + 2] || ''),
      updated: Number(row[tail + 3] || 0)
    };
  }).filter(function (r) { return r.harvest && r.date; });
}

function rowValues_(item) {
  var t = item.tasks || {};
  return [item.facility || '', item.harvest, item.date]
    .concat(TASK_IDS.map(function (id) { return !!t[id]; }))
    .concat([item.amBy || '', item.pmBy || '', item.note || '', Number(item.updated) || Date.now()]);
}

function checkCode_(given) {
  return String(given || '') === String(ACCESS_CODE);
}

function doGet(e) {
  try {
    if (!checkCode_(e && e.parameter && e.parameter.code)) {
      return json_({ ok: false, auth: false, error: 'bad code' });
    }
    var harvest = (e && e.parameter && e.parameter.harvest) || '';
    var facility = (e && e.parameter && e.parameter.facility) || '';
    var all = readRows_();
    var harvests = [], facilities = [];
    all.forEach(function (r) {
      if (r.facility && facilities.indexOf(r.facility) < 0) facilities.push(r.facility);
      if ((!facility || r.facility === facility) && harvests.indexOf(r.harvest) < 0) harvests.push(r.harvest);
    });
    harvests.sort(); facilities.sort();
    var rows = all.filter(function (r) {
      return (!facility || r.facility === facility) && (!harvest || r.harvest === harvest);
    });
    return json_({ ok: true, facilities: facilities, harvests: harvests, rows: rows });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var item = JSON.parse(e.postData.contents);
    if (!checkCode_(item.code)) return json_({ ok: false, auth: false, error: 'bad code' });
    if (!item.facility || !item.harvest || !item.date) {
      return json_({ ok: false, error: 'facility, harvest and date are required' });
    }

    var sh = sheet_();
    var existing = readRows_().filter(function (r) {
      return r.facility === (item.facility || '') && r.harvest === item.harvest && r.date === item.date;
    })[0];

    if (existing) {
      // last write wins, so a stale phone coming back online can't undo newer ticks
      if (Number(item.updated || 0) < existing.updated) {
        return json_({ ok: true, skipped: 'older' });
      }
      sh.getRange(existing.rowIndex, 1, 1, HEADERS.length).setValues([rowValues_(item)]);
    } else {
      sh.appendRow(rowValues_(item));
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}
