# فِقْهُ الرُّوح: Android package (WebView shell)

A small Android app that opens the offline web app inside the package. Not a native rewrite: the screens are the same HTML app from `../fiqh-alruh-source`.
- No permissions, no internet access (network loads are blocked in the shell).
- Min Android 7.0 (API 24), target 14. Package `app.fiqhalruh`.
- Saving uses the web app's browser storage inside the app's private data. Not synced. Uninstalling removes it. Settings has a copy/paste backup and restore for notes.
- Back button: closes a note sheet, goes back a screen, then exits at the top level.
- Status: built and signature-checked only (versionCode 5 is the latest build). It has not been launch-tested on a device or emulator.

## Build
1. In `../fiqh-alruh-source` run `python3 build.py`.
2. Install JDK 17 and Android command-line tools; install `platforms;android-34` and `build-tools;34.0.0` with sdkmanager.
3. Create your own signing key once (see top of `build.sh`) and keep the file and password safe. An update installs over an older version only if signed with the same key.
4. Run: `ANDROID_HOME=... KEYSTORE=... KEY_ALIAS=... KEYSTORE_PASS=... ./build.sh`
5. Output: `build/fiqh-alruh.apk`. Install it by sideloading (your phone will ask to allow installing from the app that opens the file).
