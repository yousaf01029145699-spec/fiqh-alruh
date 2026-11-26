package app.fiqhalruh;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Alarms are wiped when the device shuts down, and wall-clock schedules go stale
 * when the clock or timezone moves or the app is replaced; this restores all
 * enabled adhkar reminders in each of those cases.
 */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(a)
                || Intent.ACTION_TIME_CHANGED.equals(a)
                || Intent.ACTION_TIMEZONE_CHANGED.equals(a)
                || Intent.ACTION_DATE_CHANGED.equals(a)
                || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) {
            ReminderScheduler.rescheduleAll(context.getApplicationContext());
        }
    }
}
