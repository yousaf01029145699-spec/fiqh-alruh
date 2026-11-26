#!/usr/bin/env bash
# Builds a signed APK. Run from this folder.
# Needs: JDK 17, Android SDK build-tools 34 + platform android-34, Python 3.
# Env: ANDROID_HOME (SDK path), KEYSTORE (path to your .jks), KEY_ALIAS, KEYSTORE_PASS (read from env, never stored here).
# First time: make your own key, keep it and its password safe, you need the SAME key for every update:
#   keytool -genkeypair -keystore my-release.jks -alias fiqh -keyalg RSA -keysize 2048 -validity 10000
set -euo pipefail
cd "$(dirname "$0")"
: "${ANDROID_HOME:?set ANDROID_HOME}" "${KEYSTORE:?set KEYSTORE}" "${KEY_ALIAS:?set KEY_ALIAS}" "${KEYSTORE_PASS:?set KEYSTORE_PASS}"
BT="$ANDROID_HOME/build-tools/34.0.0"; AJ="$ANDROID_HOME/platforms/android-34/android.jar"
SRC_HTML="${APP_HTML:-../fiqh-alruh-source/output/fiqh-alruh.html}"
[ -f "$SRC_HTML" ] || { echo "Build the web app first (python3 build.py in fiqh-alruh-source) or set APP_HTML"; exit 1; }
rm -rf build; mkdir -p build/classes
cp "$SRC_HTML" app/assets/index.html
"$BT/aapt2" compile --dir app/res -o build/res.zip
"$BT/aapt2" link -o build/base.apk -I "$AJ" --manifest app/AndroidManifest.xml -R build/res.zip -A app/assets --min-sdk-version 24 --target-sdk-version 34 --version-code "${VERSION_CODE:-1}" --version-name "${VERSION_NAME:-0.1-prototype}"
javac -encoding UTF-8 -source 8 -target 8 -cp "$AJ" -d build/classes app/src/app/fiqhalruh/*.java
"$BT/d8" --release --lib "$AJ" --output build build/classes/app/fiqhalruh/*.class
cp build/base.apk build/unsigned.apk; (cd build && zip -q unsigned.apk classes.dex)
"$BT/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-pass env:KEYSTORE_PASS --ks-key-alias "$KEY_ALIAS" --out build/fiqh-alruh.apk build/aligned.apk
"$BT/apksigner" verify build/fiqh-alruh.apk && echo "Built build/fiqh-alruh.apk"
