# Handoff — NLT Dry Room SOP

Context for picking this work up in a new session. Read this first.

---

## What this is

A new Dry Room SOP for NLT, built as the upstream precursor to the existing ESG / NLT Post-Processing SOP. It covers everything from harvest take-in to the moment flower leaves the dry room for bucking. The Post-Processing SOP picks up at Stage 1 (Bucking) and is already live.

Two deliverables, both drafted:

| File | Role |
|---|---|
| `sop-dry-room.md` | Source of truth. Full SOP including Changes and Open Items sections that do **not** appear on the published page. |
| `DryRoomSOP.html` | Published dashboard. Standalone, deploys to GitHub Pages alongside `ProcessingSOP.html`. |

Repo: `github.com/LoboFrames/CannaSOP`, files live under `Documents/Projects/CannaSOP/`.

---

## House conventions — match these, they come from ProcessingSOP.html

- **Screen-only.** No print buttons, no print stylesheet. Don't reintroduce them.
- **Phone-first.** Most viewing is on iPhone. Any new wide element needs a mobile treatment or Safari zooms the whole page out.
- **Bilingual EN / 简体中文** via a toggle. Implemented with paired `<span class="en">` / `<span class="zh">` and a `body.lang-zh` class.
- **Mobile ≤700px:** sticky pill nav replaces header controls; tables restyle into labelled stacked cards using `data-label-en` / `data-label-zh` swapped in JS on language change; inputs are 16px so iOS doesn't zoom on focus; safe-area insets respected.
- **Dark mode follows the iOS system setting** on phones. No manual theme button in the sticky bar. Desktop header has a theme cycle.
- **Standalone.** No external dependencies, no CDN links, no fonts to fetch. System font stack only.
- **No "TBD" or placeholder text on the published page.** Track gaps in Open Items in the markdown instead.
- Temps in °F, weights in lb.

---

## The design, and why it is the way it is

Don't undo these without a reason — each one solves a specific failure the previous SOP had.

**Harvest Monday, Day 8 target takedown, Day 12 outer bound.** Framed as a target with a bound, not an 8-to-12 range. An open-ended window drifts; "we'll see how it looks Monday" is how a nine-day dry quietly becomes eleven. Days 9–12 render as dashed contingency cells, not schedule.

**Load assessment on Day 1.** Plant count, poundage, leaf load, dehumidifier count, and AC status are all known before the room is loaded, so a long dry is predictable at intake rather than discoverable on Monday. Batches classify Standard or Heavy, and Heavy gets communicated to the trim room on Day 1 — Rob and the aunties schedule a week out.

**Day 5 checkpoint.** Friday is the last day a setpoint change can meaningfully move Monday's number. Checking only at takedown tells you whether you succeeded without letting you do anything about it.

**Day 7 routing decision.** Phase 3 (70°F / 55%) is a *hold* condition — its job is to stop the flower drying while the crew works. Setting it Sunday night on a batch that then fails Monday's gate wastes a full day at 55%. So Sunday gets a short read that routes the batch: set Phase 3, or hold Phase 2 and plan to extend.

**Extension holds Phase 2, it does not continue Phase 3.** If the Day 8 gate fails, the room goes back to 65°F / 45% that same morning.

**Setpoint-vs-actual RH is a required daily field.** This is the extension diagnostic and the most useful thing added. Two very different causes look identical at takedown:
- Actual tracked setpoint all cycle → the load was simply large, nothing is broken, it needs time.
- Actual ran *above* setpoint → dehumidification capacity is the constraint. Turning the dial lower does nothing, because the room already can't reach the number it has. Fixable mid-cycle by adding portables or cutting the fresh-air exchange rate.

**Moisture acceptance narrowed from the old 8–12% to 11–12%.** 8% is overdried — brittle, trichome-shedding, lighter on the scale. The old range let an overdried lot pass verification with no flag.

**Day 12 landing on Friday is convenient**, not accidental: buck Friday, cure across the weekend, machine trim Monday.

---

## The three readiness tests

Each has a different blind spot; that's why all of them run.

1. **Snap test** — 60%+ of small lateral branches (pencil-thickness and under) snap cleanly. Main stalks still bending is normal; waiting on them overdries the batch. Reads the stem, not the bud.
2. **Pin moisture meter** — buds 11–12% MC, thin stems 10–12%. Probe through the bud shoulder toward the stem, pins fully sunk, 3–5 buds per point across at least four room positions. Reads closer to the surface than the core on dense nugs.
3. **Harvest day wet weight loss** — 75–80% loss from Day 0 wet weight. Three tagged branches placed high, low, and in slow-moving air. The only non-destructive test and the only one that catches a batch that snaps clean with a wet core.
*(A fourth check, sealed-container equilibration, was added in v1.2 and removed in v1.4 — see Task 7.)*

**Conflict resolution:** weight wins on the wet side (stems snapping at 60% loss means a wet interior — don't take it down). Meter wins on the dry side (under 10% is overdried regardless of weight; get it down and flag downstream, the cure can't add moisture back). With the container test gone there is no tiebreaker — weight is the senior check.

---

## Task queue

1. ~~**Add the sealed-container equilibration test as a fourth check** in both files.~~ **Done, v1.2.** In the gate table as a fourth row (58–62% RH at 60–90 min, confirmed at 24 h), as step 3 of the Day 5 method list, in the markdown equipment list, and as a "set the container first" callout on the gate — it needs 60–90 min, so it goes in at the start of the shift. Conflict resolution rewritten three ways: weight wins wet, meter wins dry, container breaks ties. The Open Items aw bullet now names it as the working stand-in rather than listing it as missing.
2. ~~**Rewrite the Day 12 hard stop as a mandatory Lead escalation.**~~ **Done, v1.2.** Day 12 no longer forces the batch down anywhere in either file. It now forces a same-day Lead → Supervisor escalation, a decision recorded with its cause either way, and same-day notice to the trim room and Rob. Updated in: §2, the day map, §11 (section rewritten), the §12 exception row, §14 documentation and sign-off, the Changes section, and in the HTML the cycle-strip flag (Hard stop → Escalate), the how-it-works paragraph, the extension callout, the exception row, and a new sign-off field.
3. **Replace the Day 5 and Day 7 pace bands with real numbers** once two or three cycles of branch weights exist. They are currently estimates and are labelled as such on the page. **Still open.**
4. **Publish** to the CannaSOP repo. **Ready** — both files are at v1.2 and in sync; publish from GitHub Desktop.

5. ~~**Name the moisture meter and pin it to the room.**~~ **Done, v1.3.** Lobo bought a single FLIR MR40 (chosen over the MR55: IP54 vs IP40 matters in a room with condensate and IPA-wiped pins, and the built-in flashlight suits a blackout room; the MR55's Bluetooth exports PDF only, so it does not feed Task 3). Named in the equipment list, new Room Prep step 4 forbids substituting another meter mid-cycle, and a gate callout states the band is this meter's number on this flower. **New Open Item:** only one unit, so there is no drift cross-check — a second matched MR40 is the cheap fix, an Ohaus MB32 LOD analyzer (~$3,100) the real anchor.
6. ~~**Add a photo step to the gate.**~~ **Done, v1.3.** One frame per room position with the pins still in the bud, filed with the batch record — captures reading, position and probe depth together, and builds a visual reference for what 11–12% looks like.

7. ~~**Remove the sealed-container equilibration test.**~~ **Done, v1.4 — reverses Task 1.** Lobo pulled it. The hour-plus wait before a usable read does not fit a takedown morning. Gone from the gate table, the Day 5 method list, the equipment list, the conflict rules, and both files' callouts; the gate is a three-check gate again. **Do not re-add it without asking** — it was added and removed deliberately, and the reasoning for both is recorded in the Changes section. The gap it leaves is now its own Open Item: nothing on site reads interior moisture directly, and weight loss is the closest proxy.
8. ~~**Replace the word "sentinel."**~~ **Done, v1.4.** It meant nothing to a reader coming to it cold. The measurement is now **harvest day wet weight** (replacing "Day 0 wet weight" too), and the three branches are just **tagged branches**. Chinese moved 监测枝 → 标记枝 and 第0天湿重 → 采收日湿重; "Sentinel loss" is now plain 失重 / "weight loss" throughout. 38 occurrences across both files.

### Terminology, current
- **harvest day wet weight** — the Day 0 baseline and the name of the third gate check
- **tagged branches** — the three weighed branches, placed high / low / slow air
- **weight loss** — percent lost against that baseline (never "sentinel loss")

### Meter background, so it does not get re-litigated
No pin meter on the market carries a cannabis calibration. The cannabis-branded ones (454 Bags, Triminator/Mobius, Tom's Tumble Trimmer) are wood/building-material resistance meters in different housings, reading a wood scale. That is *why* the SOP now pins the band to one named unit. The instruments that are genuinely cannabis-specific are loss-on-drying analyzers (true %MC — Ohaus MB32 ~$3,100, Mettler Toledo HX204 premium, validated against oven and Karl Fischer) and water activity meters (free water / microbial risk — already in Open Items). NIR handhelds (Kett KJT130) are non-contact but need a curve built with an LOD analyzer first, so they are never a first purchase.

### Verified on the v1.2 and v1.3 passes
Tag balance clean, EN/ZH span parity 265/265, every `data-label-en` paired with a `data-label-zh`, gate table four rows of three cells, checklist count still 8/8. Re-verified after v1.4: tags balanced, EN/ZH parity 263/263, gate back to three rows of three cells, no stale "sentinel" or container wording in either file. Also fixed a corrupted character that was sitting in the Chinese text of the old Day 12 callout.

---

## Open decisions — need Lobo and Jeff, not a code change

- **The Days 1–3 setpoint of 20% RH.** This is the biggest open question. At 20% the bud exterior can dry far faster than moisture migrates out of the interior, which crusts the surface, traps water inside, and locks chlorophyll into the tissue — the path to a hay smell and a batch that reads dry outside and wet in the core. Common commercial practice runs 55–60% throughout, or steps *down* rather than up. Cheapest way to settle it: run one room at 50% for Days 1–3 against a 20% room and compare Day 5 branch weights, finished aroma, and machine-trim breakage. **The SOP currently preserves the 20% setpoint as written.** Don't change it unilaterally.
- **Room availability during an extension.** Harvest is weekly, the dry room is single. Days 9–12 of one batch overlap Days 1–5 of the next, so an extension means next Monday's harvest has nowhere to hang. Options are a second dry space, staging the incoming harvest, or splitting it. Flagged at intake in the SOP but not solved.
- **Phase 3 at 70°F** sits at the top of the accepted band; 60–68°F is more common and 70°F accelerates terpene volatilization. Consider capping at 68°F.
- **No water activity meter on site.** The pin meter reads moisture content, which steers the dry but doesn't predict microbial risk. Rotronic AwEasy (~$4,600, ±0.008 aw, Bluetooth with per-batch PDF reports) is the shortlisted option; METER AQUALAB 3 is the chilled-mirror reference instrument. A weekly aw audit would confirm the pin meter hasn't drifted. The sealed-container test in Task 1 is the cheap stopgap.

---

## Gotchas

- **Do not shell out to `git` in the CannaSOP repo.** Running git from a Claude session leaves a stale `.git/index.lock` the sandbox can't delete. Read and write files directly. Lobo publishes from GitHub Desktop.
- **Checklist state is not persisted** on either dashboard, matching ProcessingSOP. There's an open item on the processing page about the cure log having no way to be kept — that probably wants one answer across both pages rather than two different ones. Don't solve it here in isolation.
- **Keep the markdown and HTML in sync.** Every threshold appears in both. Changing a number in one and not the other is the main way these drift.
- The Changes and Open Items sections live in the markdown only. They are notes for Lobo and Jeff, not floor content.

---

## People and vocabulary

- **Jeff (Uncle Han Sup)** — Supervisor, final sign-off.
- **Rob** — decides when the cure is ready and runs the machine trim.
- **The aunties** — hand trim and QC grading.
- **Cultivation Lead** — reviews Day 5, makes the Day 7 routing call, authorizes each extension day.
- Downstream grades: **A** = biggest nugs, **B** = Smalls (medium), **C** = Micros (very small). The sizing equipment is a **sifting tray** (筛盘) — not a shaker.
- "Bucking" = removing buds from stems, done in the trim room at 58–62°F because the buck room can't hold that target.

---

*Dry Room SOP v1.4 · September 2026. Upstream of ESG / NLT Post-Processing SOP v2.4.*
