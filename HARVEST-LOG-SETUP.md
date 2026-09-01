# Harvest log — setup

The daily log in `ProcessingSOP.html` writes to a Google Sheet, so everyone in the
facility ticks into the same record and you can see it from anywhere. This is the
one-time setup. Budget about five minutes.

## 1. Pick the sheet

Any Google Sheet works — a new one, or an existing workbook like **NLT Live Bulk
Inventory**. The script creates and writes **one tab of its own**, named
`SOP Harvest Log`, and never reads or touches your other tabs. Adding it to a workbook
you already use is fine and saves having another file to keep track of.

## 2. Add the script

In that sheet: **Extensions → Apps Script**. Delete the sample code, paste the whole
contents of `harvest-log-apps-script.gs`, and save.

> **"Attempted to execute myFunction, but it was deleted."**
> That's the editor's Run button still pointing at the sample function you deleted.
> Nothing here needs to be run by hand to work — you can skip straight to deploying.
> If you want to confirm it's wired up, pick **`setup`** in the function dropdown at the
> top and hit **Run**. It creates the `Log` tab, gets Google's permission prompt out of
> the way, and logs "Ready."

## 3. Set the crew code

Near the top of the script, change:

```js
var ACCESS_CODE = 'CHANGE-ME';
```

to a short code the crew will use, e.g. `'esg2026'`. **This is what actually protects the
log** — the SOP page is public, so the `/exec` URL in its source is not a secret. Every
request has to carry this code or the script returns nothing and saves nothing.

Give the code to the people who log: they type it once on their phone and it's remembered.
One code covers all facilities — the Facility field is for separating the records, not for
access control.

## 4. Deploy it

**Deploy → New deployment → type: Web app**, then:

| Setting | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — the SOP page calls the script without anyone logging in.
Authorise when Google asks (it will warn that the app is unverified; that's normal for
your own script — continue).

Copy the **Web app URL**. It ends in `/exec`.

## 5. Connect the page

Open `ProcessingSOP.html`, find this line near the bottom of the file:

```js
var SHEET_ENDPOINT = "";           /* <-- paste your Apps Script /exec URL here */
```

Paste the URL between the quotes, save, commit and push. **Every device that opens the
page is then connected — nobody else ever pastes a URL.** The only thing each person does
once is type the crew code.

**To test before committing:** open the page, and in the yellow "Not connected" box
paste the URL and hit Save. That connects only the device you're on, which is a safe
way to check it works.

## Changing the script later

If you edit the Apps Script, you must **Deploy → Manage deployments → edit (pencil) →
Version: New version → Deploy**. Without that step the page keeps hitting the old copy.

---

## How the log behaves

**One row per facility + harvest + day.** Ticking a box saves within a second or two. The pill
next to "Harvest daily log" tells you where things stand:

| Pill | Meaning |
|---|---|
| Synced | Everything is in the sheet |
| Saving… | In flight |
| Offline — n waiting | No signal; n days' worth of ticks are queued on the device |
| Enter crew code | This device hasn't been unlocked yet |
| Not connected | No script URL set |

**Unlocking is once per device.** A phone that has never logged before shows a small box
asking for the crew code. After that it's remembered — no login, no account, nothing to
manage. Ticks made before unlocking are not lost; they queue and upload the moment the
code goes in.

**It works with no signal.** Ticks save on the device first and queue for upload. When
the phone gets a connection back — or the page is opened again later — the queue
flushes automatically. Nobody has to remember to re-enter anything.

**Two people can log the same day.** Both devices write to the same row and the newer
edit wins. The page also re-reads the sheet every minute, so a phone in the trim room
picks up what someone ticked in storage.

**The history grid is the point.** Under the tick lists, each day is one row: five stages
× AM/PM. Each cell rolls up that stage's checks for that half of the day — **✓** all done,
**3/5** partly done, **—** nothing recorded, **·** nothing to check there. Any past day
still missing something is shaded. Scan the column and the gaps are obvious.

**Multiple facilities.** The Facility field separates them — ESG and NLT can run the same
strain name in the same week and stay completely separate records. Whatever a phone used
last is remembered, so a device that lives at one site never has to pick again.

## What lives in the sheet

Tab: **`SOP Harvest Log`** (created automatically; your other tabs are untouched).

One row per **facility + harvest + date**, 29 columns:

`Facility · Harvest · Date` then **22 individual checks** — every step of the SOP, one
column each — then `AM by · PM by · Notes · Updated`.

Morning (8): cure room env, lids off, tip bins, 15–20 min, lids on, machine room env,
hand trim room env, storage env.

End of day (14): straight to trim room, full totes only, tote weights, cure lids off,
10–15 s shake, lids on, cure ready (Rob), machine room env, A grade pulled, pounded out,
nothing uncovered, liner folded, bags folded not tied, totes lidded.

It's a normal sheet — filter by Facility to see one site, sort by Harvest, chart it, or
hand it to anyone who asks how a given run was handled.

### Adding or changing a check later

The checks live in two places and must stay in the same order: `TASKS` in
`ProcessingSOP.html` and `TASK_IDS` + `HEADERS` in the Apps Script. **Append new ones at
the end** rather than inserting in the middle, so existing columns don't shift under data
you've already collected.

## Who can see what

The `LoboFrames/CannaSOP` repo is public, so `ProcessingSOP.html` is on the open internet.
That's fine for a procedure document, but it means the `/exec` URL inside it is visible to
anyone who views the page source. The crew code is what closes that gap.

| | Can they reach the log? |
|---|---|
| Anyone who finds the SOP page | **No** — without the code the web app returns nothing and accepts nothing |
| Crew with the code | Yes — read and write the `SOP Harvest Log` tab, through the page only |
| You + boss + processing lead (sheet shared) | Yes — the full workbook in Google Sheets |

The web app's two endpoints only ever touch the `SOP Harvest Log` tab, so the rest of
NLT Live Bulk Inventory is not reachable through it, code or no code.

**Rotating the code** (someone leaves, or it gets passed around): change `ACCESS_CODE`,
then Deploy → Manage deployments → edit → New version. Every device is locked out until
its user types the new code, which is exactly what you want.

One residual note: the script runs with your permissions on the whole spreadsheet, so a
future *edit to the script itself* could reach the other tabs. Worth a look before pasting
in changes you didn't write.
