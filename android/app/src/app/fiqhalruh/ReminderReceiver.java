package app.fiqhalruh;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Receives one adhkar reminder alarm. Does only fast work here (the broadcast
 * execution limit is about 10s, and goAsync does not extend it): posts the
 * notification, hands audible playback to ReminderService (a foreground
 * service; exact-alarm invocation is a documented exemption from the
 * background-start restriction), and schedules tomorrow's occurrence.
 *
 * If the system refuses the service start (possible when the exact-alarm
 * grant was revoked and this alarm went out as inexact), it falls back to a
 * short inline tone and skips speech; speech is only promised through the
 * foreground-service path. If POST_NOTIFICATIONS is denied the system
 * silently drops the visual notification while tone and speech still play;
 * the page can read that state via __FIQH_REMIND.notificationsGranted().
 *
 * No full-screen intent: an opt-in dhikr reminder surfaces as a high-priority
 * heads-up notification plus audio, not a screen takeover.
 */
public class ReminderReceiver extends BroadcastReceiver {
    public static final String CHANNEL_ID = "adhkar_reminders_v2";
    static final String OLD_CHANNEL_ID = "adhkar_reminders";
    static final String OLD_REVIEW_CHANNEL = "review_reminders";

    /** Channel with an explicit default notification sound. Old ids are deleted: Android keeps a channel's first settings forever. */
    static void makeChannel(NotificationManager nm, String id, String name, String desc, int imp) {
        if (nm.getNotificationChannel(id) != null) return;
        NotificationChannel ch = new NotificationChannel(id, name, imp);
        ch.setDescription(desc);
        ch.enableVibration(true);
        ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        ch.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI,
                new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
        nm.createNotificationChannel(ch);
    }

    public static void ensureChannel(Context c) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager nm = c.getSystemService(NotificationManager.class);
            if (nm == null) return;
            try { nm.deleteNotificationChannel(OLD_CHANNEL_ID); } catch (Exception ignored) {}
            try { nm.deleteNotificationChannel(OLD_REVIEW_CHANNEL); } catch (Exception ignored) {}
            makeChannel(nm, CHANNEL_ID, "تنبيهات الأذكار", "تنبيهات مواعيد الأذكار والتسبيح", NotificationManager.IMPORTANCE_HIGH);
            makeChannel(nm, REVIEW_CHANNEL, "تذكير المراجعة", "تذكير يومي بمراجعة الدروس", NotificationManager.IMPORTANCE_HIGH);
        }
    }

    /** What the system will actually do with a reminder: shown in the app so a silent phone setting is visible. */
    public static String soundInfo(Context c) {
        StringBuilder sb = new StringBuilder();
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return "لا يمكن قراءة حالة الإشعارات.";
        sb.append(nm.areNotificationsEnabled() ? "الإشعارات: مسموحة" : "الإشعارات: مغلقة للتطبيق");
        if (Build.VERSION.SDK_INT >= 26) {
            ensureChannel(c);
            for (String id : new String[]{CHANNEL_ID, REVIEW_CHANNEL}) {
                NotificationChannel ch = nm.getNotificationChannel(id);
                if (ch == null) continue;
                sb.append("\n").append(ch.getName()).append(": ")
                  .append(ch.getImportance() == NotificationManager.IMPORTANCE_NONE ? "معطّلة"
                        : ch.getSound() == null ? "بلا صوت (الإعداد في النظام)" : "بصوت")
                  .append(ch.getImportance() >= NotificationManager.IMPORTANCE_DEFAULT ? "" : "، أهمية منخفضة");
            }
        }
        android.media.AudioManager am = (android.media.AudioManager) c.getSystemService(Context.AUDIO_SERVICE);
        if (am != null) {
            int mode = am.getRingerMode();
            sb.append("\nوضع الرنين: ").append(mode == android.media.AudioManager.RINGER_MODE_NORMAL ? "عادي"
                    : mode == android.media.AudioManager.RINGER_MODE_VIBRATE ? "اهتزاز فقط" : "صامت");
            int v = am.getStreamVolume(android.media.AudioManager.STREAM_NOTIFICATION);
            sb.append("\nصوت الإشعارات: ").append(v).append(" من ").append(am.getStreamMaxVolume(android.media.AudioManager.STREAM_NOTIFICATION));
        }
        int f = nm.getCurrentInterruptionFilter();
        if (f != NotificationManager.INTERRUPTION_FILTER_ALL && f != NotificationManager.INTERRUPTION_FILTER_UNKNOWN)
            sb.append("\nوضع عدم الإزعاج: مفعّل");
        return sb.toString();
    }

    /** Posts a test notification now through the same channel and builder as a real reminder. */
    public static void testNow(Context c) {
        ensureChannel(c);
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm != null) nm.notify("test".hashCode(), buildNotification(c, "تجربة الصوت", "test"));
    }

    static PendingIntent openIntent(Context c, String id) {
        Intent open = new Intent(c, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return PendingIntent.getActivity(c, id.hashCode(), open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static Notification buildNotification(Context c, String label, String id) {
        Notification.Builder nb = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(c, CHANNEL_ID) : new Notification.Builder(c);
        nb.setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
          .setContentTitle("فِقْهُ الرُّوح")
          .setContentText("حان الآن وقت " + label)
          .setContentIntent(openIntent(c, id))
          .setAutoCancel(true)
          .setVisibility(Notification.VISIBILITY_PUBLIC)
          .setCategory(Notification.CATEGORY_REMINDER)
          .setOnlyAlertOnce(false);
        if (Build.VERSION.SDK_INT < 26) nb.setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE).setPriority(Notification.PRIORITY_HIGH);
        return nb.build();
    }

    static void playTone(Context c) {
        try {
            Uri alarm = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            MediaPlayer mp = new MediaPlayer();
            mp.setDataSource(c, alarm);
            if (Build.VERSION.SDK_INT >= 21) {
                mp.setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
            } else {
                mp.setAudioStreamType(android.media.AudioManager.STREAM_NOTIFICATION);
            }
            mp.setWakeMode(c, PowerManager.PARTIAL_WAKE_LOCK);
            mp.setOnCompletionListener(MediaPlayer::release);
            mp.setOnErrorListener((m, w, e) -> { m.release(); return true; });
            mp.prepare();
            mp.start();
        } catch (Exception ignored) {}
    }

    /**
     * True only when a fired reminder would show a notification the user can
     * stop the sound from: app notifications on, and (API 26+) the adhkar
     * channel not disabled. Without that, a reminder must stay fully silent -
     * a self-ending tone is bounded but is not an immediate user stop.
     */
    static boolean stopControlUsable(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null || !nm.areNotificationsEnabled()) return false;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = nm.getNotificationChannel(CHANNEL_ID);
            if (ch != null && ch.getImportance() == NotificationManager.IMPORTANCE_NONE) return false;
        }
        return true;
    }

    public static final String REVIEW_ID = "review";
    public static final String REVIEW_CHANNEL = "review_reminders_v2";

    /** Daily review reminder: one notification with the device's default notification sound. No service, no speech. */
    private void onReview(Context c, String id) {
        try {
            JSONObject r = ReminderStore.get(c, id);
            if (r == null) return;
            NotificationManager nm = c.getSystemService(NotificationManager.class);
            if (nm != null && nm.areNotificationsEnabled()) {
                ensureChannel(c);
                Notification.Builder nb = Build.VERSION.SDK_INT >= 26
                        ? new Notification.Builder(c, REVIEW_CHANNEL) : new Notification.Builder(c);
                nb.setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                  .setContentTitle("فِقْهُ الرُّوح")
                  .setContentText(r.optString("label", "وقت المراجعة"))
                  .setContentIntent(openIntent(c, id))
                  .setAutoCancel(true);
                if (Build.VERSION.SDK_INT < 26) nb.setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE).setPriority(Notification.PRIORITY_HIGH);
                nm.notify(id.hashCode(), nb.build());
            }
        } catch (JSONException ignored) {}
        ReminderScheduler.schedule(c, id); // tomorrow's occurrence
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        final String id = intent.getStringExtra(ReminderScheduler.EXTRA_ID);
        if (id == null) return;
        final Context c = context.getApplicationContext();
        if (REVIEW_ID.equals(id)) { onReview(c, id); return; }

        // No usable stop control: skip this occurrence entirely (no tone, no
        // speech, nothing invisible) and still schedule tomorrow's, in case
        // the user re-enables notifications. The settings UI explains the
        // disabled-audible state and links to the system setting.
        if (!stopControlUsable(c)) {
            ReminderScheduler.schedule(c, id);
            return;
        }

        final JSONObject r;
        try {
            r = ReminderStore.get(c, id);
        } catch (JSONException e) {
            return;
        }
        if (r == null) return;
        final String label = r.optString("label", "الذكر");

        ensureChannel(c);
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm != null) nm.notify(id.hashCode(), buildNotification(c, label, id));

        ReminderScheduler.schedule(c, id); // tomorrow's occurrence
    }
}
