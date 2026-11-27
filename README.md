# فِقْهُ الرُّوح | Fiqh al-Ruh

## بالعربية

تطبيق عربي من اليمين إلى اليسار: فقه العبادات ومعانيها، والأذكار، ومواقف سريعة، والآخرة (القيامة والجنة والنار وعلامات الساعة). يعمل بدون إنترنت. يُبنى في ملف HTML واحد، ثم يُغلَّف في تطبيق أندرويد (WebView).

### أين أغيّر ماذا

| أريد أن أغيّر | الملف |
|---|---|
| **التصميم**: الألوان والخطوط والمسافات والوضع الليلي | `style.css` (المتغيرات في أعلاه) |
| الخطوط المضمنة | `fonts.css` (Amiri و IBM Plex Sans Arabic، مضمنة base64) |
| شكل الشاشات والبطاقات (قوالب HTML داخل JavaScript) | `app.js` |
| الأيقونات | الدالة `ico()` في `app.js` |
| أيقونة التطبيق وملفات أندرويد | `android/app/res` و `android/app/AndroidManifest.xml` |
| **المحتوى**: دروس العبادات | `data/NN_bab_*.js`، ملف لكل باب |
| الأذكار والأدعية | `adhkar_data.js` |
| رأس البيانات (المذاهب، الملاحظة المصدرية) | `data/00_head.js` |

لا تعدّل `data.js` ولا `output/` ولا `docs/`، فهي تُولَّد من `build.py`.

### البناء
1. `python3 build.py` ينتج `output/fiqh-alruh.html` (افتحه في أي متصفح). يحتاج Python 3 فقط.
2. الفحص الآلي (يحتاج Node 22 وChrome): `node tools/cdp.js` ثم تأكد أن آخر سطرين `overflow false` و`errs []`.
3. لو حذفت معرّف درس عمداً: `python3 build.py --approve-removal`.
4. للنشر على GitHub Pages: انسخ `output/fiqh-alruh.html` إلى `docs/index.html`.

### بناء ملف APK
1. ثبّت JDK 17 وأدوات سطر أوامر أندرويد، ثم `platforms;android-34` و`build-tools;34.0.0`.
2. أنشئ مفتاح توقيع خاصاً بك مرة واحدة (الأمر في أعلى `android/build.sh`) واحتفظ به وبكلمة مروره. لا يوجد مفتاح ولا كلمة مرور في هذا المستودع. التحديث يُثبَّت فوق النسخة القديمة فقط إذا وُقّع بالمفتاح نفسه.
3. من مجلد `android`:
   `ANDROID_HOME=... KEYSTORE=... KEY_ALIAS=... KEYSTORE_PASS=... VERSION_CODE=51 VERSION_NAME=0.51 ./build.sh`
   ارفع `VERSION_CODE` في كل إصدار. الناتج: `android/build/fiqh-alruh.apk`.

### قواعد المحتوى والمصادر
- كل آية وحديث وقول مذهب له مصدره في حقل المصدر. لا يُكتب رقم صفحة أو درجة حديث لم يُقرأ في المصدر نفسه.
- خانات الخلاف تُظهر فقط المذاهب التي ثبت قولها في الصفحة. المذهب بلا قول موثق لا يُعرض.
- ما ضعّفه محقق الكتاب في حاشيته لا يدخل درساً.
- مصادر الحديث: صحيح البخاري ومسلم بالنص المطبوع، وغيرهما بدرجته كما في الكتاب المنقول عنه.
- النصوص الظاهرة لا تحوي روابط ولا شرطات طويلة (—).
- عند العرض، `app.js` يخفي تلقائياً عبارات حدود القراءة الداخلية (الدالة `cleanStr`). المحتوى في `data/` لا يتغير بذلك.
- التطبيق تعليمي، وليس فتوى ولا يدّعي مراجعة عالم.

### الخصوصية
بيانات المستخدم (المحفوظات والملاحظات والتقدم) على جهازه فقط. لا حساب ولا خادم. لا أرقام هواتف ولا أسرار في المستودع.

## English

An Arabic RTL app: worship fiqh with meanings, adhkar, quick situations, and the Hereafter (Day of Judgment, Jannah, Naar, signs of the Hour). Works offline. Builds to one HTML file, wrapped in an Android WebView app.

### Where to change what

| To change | File |
|---|---|
| **Design**: colors, fonts, spacing, dark mode | `style.css` (variables at the top) |
| Embedded fonts | `fonts.css` (Amiri, IBM Plex Sans Arabic, base64) |
| Screen and card layout (HTML templates inside JavaScript) | `app.js` |
| Icons | `ico()` in `app.js` |
| App icon, Android files | `android/app/res`, `android/app/AndroidManifest.xml` |
| **Content**: lessons | `data/NN_bab_*.js`, one file per chapter |
| Adhkar and duas | `adhkar_data.js` |
| Data header (madhhabs, source note) | `data/00_head.js` |

Do not edit `data.js`, `output/` or `docs/`: `build.py` generates them.

### Build
1. `python3 build.py` writes `output/fiqh-alruh.html` (open it in any browser). Python 3 only.
2. Automated check (Node 22 and Chrome): `node tools/cdp.js`; the last two lines must be `overflow false` and `errs []`.
3. If you remove a lesson id on purpose: `python3 build.py --approve-removal`.
4. GitHub Pages: copy `output/fiqh-alruh.html` to `docs/index.html`.

### Build the APK
1. Install JDK 17, the Android command-line tools, `platforms;android-34` and `build-tools;34.0.0`.
2. Create your own signing key once (command at the top of `android/build.sh`). Keep it and its password. No key or password is in this repo. An update installs over an older one only if signed with the same key.
3. From `android/`:
   `ANDROID_HOME=... KEYSTORE=... KEY_ALIAS=... KEYSTORE_PASS=... VERSION_CODE=51 VERSION_NAME=0.51 ./build.sh`
   Raise `VERSION_CODE` for every release. Output: `android/build/fiqh-alruh.apk`.

### Content and source rules
- Every verse, hadith and madhhab position carries its source. Never write a page number or hadith grade that was not read in that source.
- Khilaf rows show only madhhabs whose position is documented on the page. A madhhab without a sourced position is not shown.
- Anything the book editor weakened in a footnote stays out of lessons.
- Visible text has no links and no long dashes.
- At render time `app.js` removes internal reading-limit phrases (`cleanStr`). The data in `data/` is not changed by this.
- Educational app, not a fatwa, and it does not claim scholar review.

### Privacy
User data (bookmarks, notes, progress) stays on the device. No account, no server. No phone numbers or secrets in this repo.

### Other folders
`tools/` automated checks and PDF export. `tools/history/` old one-off content scripts, kept for history only. `calc_engine.js` inheritance engine kept for the faraid screen.
