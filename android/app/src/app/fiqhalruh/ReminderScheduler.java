package app.fiqhalruh;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Schedules/cancels exact alarms for adhkar reminders.
 * Uses setAlarmClock (never adjusted by the system, visible to the user) when the
 * exact-alarm capability is available; otherwise falls back to an inexact alarm and
 * reports that so the UI can ask the user to grant "Alarms & reminders" access.
 */
public final class ReminderScheduler {
    static final String EXTRA_ID = "reminder_id";

    private ReminderScheduler() {}

    /** True when exact alarms are allowed (always true before Android 12 / API 31). */
    public static boolean canExact(Context c) {
        if (Build.VERSION.SDK_INT < 31) return true;
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        return am != null && am.canScheduleExactAlarms();
    }

    /** Next wall-clock trigger (today or tomorrow) for hour:minute, in millis. */
    static long nextTrigger(int hour, int minute) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, minute);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        if (cal.getTimeInMillis() <= System.currentTimeMillis()) cal.add(Calendar.DAY_OF_YEAR, 1);
        return cal.getTimeInMillis();
    }

    private static PendingIntent pi(Context c, String id, int flags) {
        Intent i = new Intent(c, ReminderReceiver.class);
        i.setAction("app.fiqhalruh.ADHKAR_REMINDER");
        i.putExtra(EXTRA_ID, id);
        // Stable request code per reminder id so scheduling again replaces the old alarm.
        return PendingIntent.getBroadcast(c, id.hashCode(), i,
                flags | PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /**
     * Schedules the next occurrence. Returns "exact", "inexact", or "disabled".
     */
    public static String schedule(Context c, String id) {
        try {
            JSONObject r = ReminderStore.get(c, id);
            if (r == null || !r.optBoolean("enabled", true)) { cancel(c, id); return "disabled"; }
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            if (am == null) return "disabled";
            long at = nextTrigger(r.getInt("hour"), r.getInt("minute"));
            PendingIntent show = pi(c, id, 0);
            if (canExact(c)) {
                // setAlarmClock: precise time, fires even in Doze; system shows it in the status bar.
                Intent open = new Intent(c, MainActivity.class);
                PendingIntent showPi = PendingIntent.getActivity(c, id.hashCode(), open,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                am.setAlarmClock(new AlarmManager.AlarmClockInfo(at, showPi), show);
                return "exact";
            }
            // Permission not granted: inexact fallback, still wakes the device within a window.
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, show);
            return "inexact";
        } catch (JSONException | SecurityException e) {
            return "disabled";
        }
    }

    public static void cancel(Context c, String id) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent p = pi(c, id, PendingIntent.FLAG_NO_CREATE);
        if (am != null && p != null) {
            am.cancel(p);
            p.cancel();
        }
        NotificationManager nmc = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nmc != null) nmc.cancel(id.hashCode());
    }

    /** Reschedules every enabled reminder (used after boot and after app start). */
    public static void rescheduleAll(Context c) {
        try {
            for (String id : ReminderStore.enabledIds(c)) schedule(c, id);
        } catch (JSONException ignored) {}
    }
}
