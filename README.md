# فِقْهُ الرُّوح: مصدر التطبيق (نموذج أولي)

Source for the standalone Arabic RTL web app. Detailed lessons across purification, prayer, fasting, zakat, hajj, Quran etiquette and inheritance (الفرائض, with an exact-fraction calculator), plus adhkar with meanings and a quick-situations (مواقف سريعة) section. Not reviewed by a religious scholar.

Content status: verification against printed sources is in progress. `node tools/review.js` currently reports 95 declared content gaps across 77 lessons and 550 school-difference rows. Treat any row marked "قيد الاستكمال" or "خارج نطاق هذا الدرس" as unfinished, not as a settled ruling.

## Files
- `data.js`: fiqh content (lessons, evidence, school differences, quizzes, reflections, situations). Edit fiqh content here.
- `adhkar_data.js`: adhkar, tasbih and dua sections with sources and meaning cells (`window.ADHKAR_SECTIONS`).
- `calc_engine.js`: engine of the removed inheritance calculator (BigInt exact fractions), still inlined by build.py but not used by any screen. Not covered: pregnancy, khuntha, missing heir, dhawi al-arham, munasakhat.
- `gen/`: scripts that merge the Quran and Fara'id chapters into data.js.
- `app.js`: screens, routing, buttons, state, saving, search, quizzes, notes.
- `style.css`: colors, layout, dark mode.
- `fonts.css`: Amiri and IBM Plex Sans Arabic embedded as base64 (open fonts, SIL OFL) so the app works offline.
- `build.py`: joins the files above into one file, `output/fiqh-alruh.html`. Also checks content ids against `expected_ids.json`; pass `--approve-removal` when ids were removed on purpose.
- `android/`: minimal Android WebView wrapper (builds the signed APK from the HTML build; the signing keystore is not part of this repo).
- `tools/cdp.js`: automated check with headless Chrome (clicks through the screens, checks for errors and sideways scrolling, writes screenshots to `output/`).
- `tools/pdf.js`: makes a phone-sized PDF of the content, `output/fiqh-alruh-mobile.pdf`.

## What exists (77 lessons)
- الطهارة والوضوء: 15 lessons. الصلاة: 29. الزكاة والصدقة: 3. الصيام: 4. الحج والعمرة: 5. باب المتنوعات: 2. باب القرآن (أحكام القرآن وآدابه): 10. باب الفرائض (المواريث): 9.
- Inheritance calculator: removed from the app at the owner's explicit request (it was present in build vc26). Not available in the interface. `calc_engine.js` remains in the repo, unused by the interface.
- Also: adhkar (morning, evening, sleep, waking, tasbih, duas), quick situations (مواقف سريعة), personal notes and bookmarks, search, quizzes per lesson, terms key (مفتاح المصطلحات, inside a collapsible card on the home screen), an opening screen with the salawat, settings (font, dark mode, daily goal, glass tap sound), manual backup.
- Coverage is partial in the shorter chapters (zakat 3 lessons, fasting 4, hajj 5 lessons); they are not complete treatments of those topics.

## What does NOT exist
- No tajweed, tafsir, audio or full mushaf. The «سُنّة اليوم» feature is not built.
- Content gaps are declared in the app as «قيد الاستكمال» (see the Content status line above); they are not filled from unread sources.

## Requirements
- Python 3 (build.py uses only the standard library)
- Node.js 22 or newer (cdp.js uses the built-in WebSocket and fetch)
- Google Chrome or Chromium. If the command is not `google-chrome`, set it: `CHROME=chromium node tools/cdp.js`

## Run (from this folder)
1. `python3 build.py` makes `output/fiqh-alruh.html`. Open it in any browser; it works without internet.
2. `node tools/cdp.js` expected last lines: `overflow false` and `errs []`.
3. `node tools/pdf.js` makes `output/fiqh-alruh-mobile.pdf`.

## Android APK
- The last APK built from this source family is vc26 (0.26-prototype, it still contained the calculator); the current source here is vc26 minus the calculator, and an APK of it has not been built yet. APKs are made with `android/build.sh` from `output/fiqh-alruh.html`. The web build in `docs/index.html` (GitHub Pages) is the same content and features, including the daily study goal (Settings, then goal; the home screen then shows «هدف اليوم»).
- `fiqh-alruh-android-v0.14.apk` at the repo root is an old build kept only for history. Do not use it. APK files are signed with a private key that is not in this repo.

## Notes
- Saving: bookmarks, notes, progress and settings are stored in the browser (localStorage) on this device only. If storage is blocked they stay in memory until the page closes and a notice shows. Nothing syncs. Settings has a manual backup: "تجهيز النسخة" shows a text you copy and keep; pasting it back and pressing "استرجاع" (twice) restores notes, bookmarks and progress.
- Sources: every ruling has a source field in `data.js`. Items not checked against a source are marked "خارج نطاق هذا الدرس" (outside the scope of this lesson). Re-check evidence against published texts before changing it.
- Deployment: the same single HTML file can be put on any static host. Publication details are not part of this source.

## Scholar-review handoff
`node tools/review.js` writes a review handoff markdown file from `data.js`: every lesson, its sources, and every school cell that has no documented position. Review comments can be tied to a lesson id and a khilaf row id. The app is an intermediate preview and has not been reviewed by a scholar.
Visual checks: `node tools/vis.js` (tablet, dark, large font screenshots). Content checks: `LESSONS=a,b node tools/cdp.js`.
