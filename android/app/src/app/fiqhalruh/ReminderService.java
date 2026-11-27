package app.fiqhalruh;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;

import org.json.JSONException;
import org.json.JSONObject;


/**
 * Foreground service that owns the audible part of one fired reminder:
 * the alarm-stream tone plus an optional spoken reminder name (Arabic TTS).
 * A foreground service keeps the process alive for the playback, which a
 * wakelock held inside a broadcast receiver cannot guarantee (the ~10s
 * broadcast execution limit still applies after goAsync). Starting this
 * service from the reminder alarm is covered by the documented exemption
 * for exact alarms that complete a user-requested action.
 *
 * Stop paths, all honored: the notification action «إيقاف الصوت» (works on
 * the lock screen), playback completion of both tone and speech, and a 90s
 * safety cap. Hardware keys are owned by the system: volume keys only lower
 * the alarm volume and the power button cannot be intercepted by an app,
 * so neither is treated as a stop control.
 */
public class ReminderService extends Service {
    public static final String ACTION_STOP = "app.fiqhalruh.REMINDER_STOP";
    private static final long MAX_MS = 90_000;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wl;
    private boolean stopping;
    private MediaPlayer mp;

    @Override public IBinder onBind(Intent i) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            finishNow();
            return START_NOT_STICKY;
        }
        final String id = intent != null ? intent.getStringExtra(ReminderScheduler.EXTRA_ID) : null;
        if (id == null) { finishNow(); return START_NOT_STICKY; }

        JSONObject r;
        try { r = ReminderStore.get(this, id); }
        catch (JSONException e) { r = null; }
        if (r == null) { finishNow(); return START_NOT_STICKY; }
        final String label = r.optString("label", "الذكر");

        // The receiver already skipped this occurrence when no stop control is
        // usable; re-check here because the state can change between alarm and
        // service start. No usable stop control means no audio at all.
        if (!ReminderReceiver.stopControlUsable(this)) { finishNow(); return START_NOT_STICKY; }

        Notification n = ReminderReceiver.buildNotification(this, label, id);
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(id.hashCode(), n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(id.hashCode(), n);
        }

        wl = ((PowerManager) getSystemService(POWER_SERVICE))
                .newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "fiqhalruh:reminderSvc");
        wl.acquire(MAX_MS); // platform backstop; finishNow is the normal path
        handler.postDelayed(this::finishNow, MAX_MS);

        playSystemSound();
        return START_NOT_STICKY;
    }

    /** Plays the device's own default notification sound once (a recorded system sound; no speech synthesis). */
    private void playSystemSound() {
        try {
            Uri u = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            if (u == null) { finishNow(); return; }
            mp = new MediaPlayer();
            mp.setDataSource(this, u);
            if (Build.VERSION.SDK_INT >= 21) {
                mp.setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
            }
            mp.setOnCompletionListener(m -> finishNow());
            mp.setOnErrorListener((m, w, e) -> { finishNow(); return true; });
            mp.prepare();
            mp.start();
        } catch (Exception e) {
            finishNow();
        }
    }

    private synchronized void finishNow() {
        if (stopping) return;
        stopping = true;
        handler.removeCallbacksAndMessages(null);
        try { if (mp != null) { mp.release(); mp = null; } } catch (Exception ignored) {}
        try { if (wl != null && wl.isHeld()) wl.release(); } catch (Exception ignored) {}
        if (Build.VERSION.SDK_INT >= 24) stopForeground(STOP_FOREGROUND_REMOVE);
        else stopForeground(true);
        stopSelf();
    }

    @Override
    public void onDestroy() {
        finishNow();
        super.onDestroy();
    }
}
