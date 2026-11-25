package app.fiqhalruh;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Opens the bundled offline app (assets/index.html). No network, no permissions. */
public class MainActivity extends Activity {
    private static final String START = "file:///android_asset/index.html";
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
        + "if(h&&h!=='#'&&h!=='#/'&&h!=='#/home'){location.hash='#/home';return 'h';}"
        + "return 'x';})()";

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().setStatusBarColor(Color.parseColor("#0F4C3A"));
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
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                // Keep everything inside the bundled app; block any other navigation.
                return !r.getUrl().toString().startsWith("file:///android_asset/");
            }
        });
        if (b != null) web.restoreState(b); else web.loadUrl(START);
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
