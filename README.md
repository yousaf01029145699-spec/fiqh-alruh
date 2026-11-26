# فِقْهُ الرُّوح: مصدر التطبيق (نموذج أولي)

Source for the standalone Arabic RTL web app. Detailed lessons across purification, prayer, fasting, zakat, hajj, Quran etiquette and inheritance (الفرائض, with an exact-fraction calculator), plus adhkar with meanings and a quick-situations (مواقف سريعة) section. Not reviewed by a religious scholar.

Content status: verification against printed sources is in progress. `node tools/review.js` currently reports 95 declared content gaps across 77 lessons and 550 school-difference rows. Treat any row marked "قيد الاستكمال" or "خارج نطاق هذا الدرس" as unfinished, not as a settled ruling.

## Files
- `data.js`: fiqh content (lessons, evidence, school differences, quizzes, reflections, situations). Edit fiqh content here.
- `adhkar_data.js`: adhkar, tasbih and dua sections with sources and meaning cells (`window.ADHKAR_SECTIONS`).
- `calc_engine.js`: inheritance calculator engine (BigInt exact fractions), inlined by build.py. Not covered: pregnancy, khuntha, missing heir, dhawi al-arham, munasakhat.
- `gen/`: scripts that merge the Quran and Fara'id chapters into data.js.
- `app.js`: screens, routing, buttons, state, saving, search, quizzes, notes.
- `style.css`: colors, layout, dark mode.
- `fonts.css`: Amiri and IBM Plex Sans Arabic embedded as base64 (open fonts, SIL OFL) so the app works offline.
- `build.py`: joins the files above into one file, `output/fiqh-alruh.html`. Also checks content ids against `expected_ids.json`; pass `--approve-removal` when ids were removed on purpose.
- `android/`: minimal Android WebView wrapper (builds the signed APK `fiqh-alruh-android-v0.14.apk` at the repo root; the signing keystore is not part of this repo).
- `tools/cdp.js`: automated check with headless Chrome (clicks through the screens, checks for errors and sideways scrolling, writes screenshots to `output/`).
- `tools/pdf.js`: makes a phone-sized PDF of the content, `output/fiqh-alruh-mobile.pdf`.

## Requirements
- Python 3 (build.py uses only the standard library)
- Node.js 22 or newer (cdp.js uses the built-in WebSocket and fetch)
- Google Chrome or Chromium. If the command is not `google-chrome`, set it: `CHROME=chromium node tools/cdp.js`

## Run (from this folder)
1. `python3 build.py` makes `output/fiqh-alruh.html`. Open it in any browser; it works without internet.
2. `node tools/cdp.js` expected last lines: `overflow false` and `errs []`.
3. `node tools/pdf.js` makes `output/fiqh-alruh-mobile.pdf`.

## Android APK
- `fiqh-alruh-android-v0.14.apk` packages the gen-120 content build. The daily-goal feature published later (gen 121) is in the web source here but NOT inside this APK until the wrapper is rebuilt.

## Notes
- Saving: bookmarks, notes, progress and settings are stored in the browser (localStorage) on this device only. If storage is blocked they stay in memory until the page closes and a notice shows. Nothing syncs. Settings has a manual backup: "تجهيز النسخة" shows a text you copy and keep; pasting it back and pressing "استرجاع" (twice) restores notes, bookmarks and progress.
- Sources: every ruling has a source field in `data.js`. Items not checked against a source are marked "خارج نطاق هذا الدرس" (outside the scope of this lesson). Re-check evidence against published texts before changing it.
- Deployment: the same single HTML file can be put on any static host. Publication details are not part of this source.

## Scholar-review handoff
`node tools/review.js` writes a review handoff markdown file from `data.js`: every lesson, its sources, and every school cell that has no documented position. Review comments can be tied to a lesson id and a khilaf row id. The app is an intermediate preview and has not been reviewed by a scholar.
Visual checks: `node tools/vis.js` (tablet, dark, large font screenshots). Content checks: `LESSONS=a,b node tools/cdp.js`.
