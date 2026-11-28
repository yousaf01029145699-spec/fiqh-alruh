package app.fiqhalruh;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Opens the bundled offline app (assets/index.html). No network.
 * Adds a native adhkar-reminder bridge exposed to the page as window.__FIQH_REMIND.
 * The page keeps using its own WebView storage; nothing here reads or moves it.
 */
public class MainActivity extends Activity {
    private static final String START = "file:///android_asset/index.html";
    private static final int REQ_NOTIF = 41;
    private WebView web;

    // Closes an open note sheet, or goes back one screen inside the app.
    // Returns "x" when the app is already at the top level.
    private static final String BACK_JS =
        "(function(){"
        + "var d=document.querySelector('dialog[open]');"
        + "if(d){d.close();return 'c';}"
        + "var s=document.querySelector('.sheet');"
        + "if(s){var bs=s.querySelectorAll('button');if(bs.length){bs[bs.length-1].click();return 'c';}}"
        + "var b=document.querySelector('button.back');"
        + "if(b){b.click();return 'b';}"
        + "var h=location.hash;"
        + "if(h&&h!=='#'&&h!=='#/home'){location.hash='#/home';return 'h';}"
        + "return 'x';})()";

    /** Native reminder bridge. One method per capability; all run off the UI thread where needed. */
    final class RemindBridge {
        /** Marker so the page can detect the native layer: !!window.__FIQH_REMIND */
        @JavascriptInterface public boolean available() { return true; }
        @JavascriptInterface public void share(String text) {
            if (text == null) return;
            final String t = text.length() > 6000 ? text.substring(0, 6000) : text;
            runOnUiThread(new Runnable() { public void run() {
                try {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType("text/plain");
                    i.putExtra(Intent.EXTRA_TEXT, t);
                    startActivity(Intent.createChooser(i, null));
                } catch (Exception e) { }
            } });
        }
        @JavascriptInterface public String soundInfo() { return ReminderReceiver.soundInfo(MainActivity.this); }
        @JavascriptInterface public void testSound() { ReminderReceiver.testNow(MainActivity.this); }

        /** "exact" | "inexact" | "disabled". */
        @JavascriptInterface public String schedule(String id, int hour, int minute, String label, boolean speak) {
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || id == null || id.length() > 64) return "disabled";
            try {
                JSONObject r = new JSONObject();
                r.put("hour", hour);
                r.put("minute", minute);
                r.put("label", label);
                r.put("speak", speak);
                r.put("enabled", true);
                ReminderStore.put(MainActivity.this, id, r);
                return ReminderScheduler.schedule(MainActivity.this, id);
            } catch (JSONException e) {
                return "disabled";
            }
        }

        @JavascriptInterface public void cancel(String id) {
            ReminderStore.remove(MainActivity.this, id);
            ReminderScheduler.cancel(MainActivity.this, id);
        }

        /** True when the app may schedule exact alarms. */
        @JavascriptInterface public boolean canExact() {
            return ReminderScheduler.canExact(MainActivity.this);
        }

        /** Opens the system "Alarms & reminders" screen so the user can allow exact alarms. */
        @JavascriptInterface public void requestExact() {
            if (Build.VERSION.SDK_INT >= 31) {
                Intent i = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
            }
        }

        /** True when posting notifications is allowed (always true before API 33). */
        @JavascriptInterface public boolean notificationsGranted() {
            if (Build.VERSION.SDK_INT < 33) return true;
            return checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                    == PackageManager.PERMISSION_GRANTED;
        }

        /** Asks the user for the notifications permission (API 33+). */
        @JavascriptInterface public void requestNotifications() {
            if (Build.VERSION.SDK_INT >= 33 && !notificationsGranted()) {
                requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
            }
        }

        /**
         * True only when a fired reminder would show a stoppable notification:
         * app notifications on and the adhkar channel not disabled. When false
         * the page must present reminders as audio-disabled and explain why.
         */
        @JavascriptInterface public boolean stopControlReady() {
            return ReminderReceiver.stopControlUsable(MainActivity.this);
        }

        /** Opens the system settings screen that restores the stop control. */
        @JavascriptInterface public void openNotificationSettings() {
            Intent i;
            if (Build.VERSION.SDK_INT >= 26) {
                ReminderReceiver.ensureChannel(MainActivity.this);
                i = new Intent(Settings.ACTION_CHANNEL_NOTIFICATION_SETTINGS)
                        .putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName())
                        .putExtra(Settings.EXTRA_CHANNEL_ID, ReminderReceiver.CHANNEL_ID);
            } else {
                i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                        .setData(android.net.Uri.parse("package:" + getPackageName()));
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(i); } catch (Exception e) {
                Intent alt = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
                        .setData(android.net.Uri.parse("package:" + getPackageName()))
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try { startActivity(alt); } catch (Exception ignored) {}
            }
        }
    }

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().setStatusBarColor(Color.parseColor("#0F4C3A"));
        ReminderReceiver.ensureChannel(this);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);               // asset URLs still load
        s.setAllowContentAccess(false);
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setBlockNetworkLoads(true);
        web.addJavascriptInterface(new RemindBridge(), "__FIQH_REMIND");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String url = r.getUrl().toString();
                if (url.startsWith("file:///android_asset/")) return false;
                // The app itself stays offline: deliberate taps on external links
                // (e.g. a future feedback form) open in the system browser instead.
                if (url.startsWith("https://") || url.startsWith("http://")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url)));
                    } catch (Exception ignored) {}
                }
                return true;
            }
        });
        if (b != null) web.restoreState(b); else web.loadUrl(START);
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] grants) {
        super.onRequestPermissionsResult(req, perms, grants);
        if (req == REQ_NOTIF) {
            // Refresh the page so the settings screen reflects the answer.
            web.evaluateJavascript("if(window.render)render()", null);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Keep schedules honest after permission changes made in system settings.
        ReminderScheduler.rescheduleAll(this);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript(BACK_JS, value -> {
            if (value == null || value.contains("x")) MainActivity.super.onBackPressed();
        });
    }
}
