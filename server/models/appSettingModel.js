import { pool } from '../config/db.js';

class AppSettingModel {
  // Fetch current version settings by app type
  static async getSettings(appType = 'user') {
    const query = `
      SELECT 
        app_type AS "appType",
        android_current AS "androidCurrent",
        android_minimum AS "androidMinimum",
        ios_current AS "iosCurrent",
        ios_minimum AS "iosMinimum",
        release_notes AS "releaseNotes",
        force_update AS "forceUpdate",
        updated_at AS "updatedAt"
      FROM app_settings
      WHERE app_type = $1;
    `;
    const { rows } = await pool.query(query, [appType]);
    return rows[0];
  }

  // Update or insert settings for given app type
  static async updateSettings(data) {
    const {
      appType = 'user',
      androidCurrent,
      androidMinimum,
      iosCurrent,
      iosMinimum,
      releaseNotes,
      forceUpdate,
    } = data;

    const query = `
      INSERT INTO app_settings (app_type, android_current, android_minimum, ios_current, ios_minimum, release_notes, force_update, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
      ON CONFLICT (app_type) DO UPDATE SET
        android_current = EXCLUDED.android_current,
        android_minimum = EXCLUDED.android_minimum,
        ios_current = EXCLUDED.ios_current,
        ios_minimum = EXCLUDED.ios_minimum,
        release_notes = EXCLUDED.release_notes,
        force_update = EXCLUDED.force_update,
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        app_type AS "appType",
        android_current AS "androidCurrent",
        android_minimum AS "androidMinimum",
        ios_current AS "iosCurrent",
        ios_minimum AS "iosMinimum",
        release_notes AS "releaseNotes",
        force_update AS "forceUpdate",
        updated_at AS "updatedAt";
    `;

    const values = [
      appType,
      androidCurrent,
      androidMinimum,
      iosCurrent,
      iosMinimum,
      releaseNotes || '',
      forceUpdate,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

export default AppSettingModel;