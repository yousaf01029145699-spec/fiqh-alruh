package app.fiqhalruh;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Persists adhkar reminder schedules as JSON in private SharedPreferences.
 * One entry per reminder id: {"hour":int,"minute":int,"label":String,"speak":boolean,"enabled":boolean}.
 * No network, no account: everything stays on the device, like the rest of the app.
 */
public final class ReminderStore {
    private static final String PREFS = "adhkar_reminders";

    private ReminderStore() {}

    private static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    /** Adds or replaces one reminder. Expects the JSON shape documented above. */
    public static synchronized void put(Context c, String id, JSONObject reminder) throws JSONException {
        // Normalize: only the fields we understand are stored.
        JSONObject r = new JSONObject();
        r.put("hour", reminder.getInt("hour"));
        r.put("minute", reminder.getInt("minute"));
        r.put("label", reminder.optString("label", ""));
        r.put("speak", reminder.optBoolean("speak", true));
        r.put("enabled", reminder.optBoolean("enabled", true));
        prefs(c).edit().putString(id, r.toString()).apply();
    }

    public static synchronized void remove(Context c, String id) {
        prefs(c).edit().remove(id).apply();
    }

    public static synchronized JSONObject get(Context c, String id) throws JSONException {
        String s = prefs(c).getString(id, null);
        return s == null ? null : new JSONObject(s);
    }

    /** All reminders as {id: reminder}. */
    public static synchronized JSONObject all(Context c) throws JSONException {
        JSONObject out = new JSONObject();
        for (String id : prefs(c).getAll().keySet()) {
            String s = prefs(c).getString(id, null);
            if (s != null) out.put(id, new JSONObject(s));
        }
        return out;
    }

    /** Ids of enabled reminders. */
    public static synchronized String[] enabledIds(Context c) throws JSONException {
        JSONObject all = all(c);
        java.util.ArrayList<String> ids = new java.util.ArrayList<>();
        for (Iterator<String> it = all.keys(); it.hasNext();) {
            String id = it.next();
            if (all.getJSONObject(id).optBoolean("enabled", true)) ids.add(id);
        }
        return ids.toArray(new String[0]);
    }
}
