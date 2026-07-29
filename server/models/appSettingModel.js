// models/appSettingModel.js
import { pool } from '../config/db.js';

class AppSettingModel {
  // Fetch current version settings
  static async getSettings() {
    const query = `
      SELECT 
        android_current AS "androidCurrent",
        android_minimum AS "androidMinimum",
        ios_current AS "iosCurrent",
        ios_minimum AS "iosMinimum",
        release_notes AS "releaseNotes",
        force_update AS "forceUpdate",
        updated_at AS "updatedAt"
      FROM app_settings
      WHERE id = 1;
    `;
    // FIXED: Changed db.query to pool.query
    const { rows } = await pool.query(query);
    return rows[0];
  }

  // Update or insert settings
  static async updateSettings(data) {
    const {
      androidCurrent,
      androidMinimum,
      iosCurrent,
      iosMinimum,
      releaseNotes,
      forceUpdate,
    } = data;

    const query = `
      INSERT INTO app_settings (id, android_current, android_minimum, ios_current, ios_minimum, release_notes, force_update, updated_at)
      VALUES (1, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        android_current = EXCLUDED.android_current,
        android_minimum = EXCLUDED.android_minimum,
        ios_current = EXCLUDED.ios_current,
        ios_minimum = EXCLUDED.ios_minimum,
        release_notes = EXCLUDED.release_notes,
        force_update = EXCLUDED.force_update,
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        android_current AS "androidCurrent",
        android_minimum AS "androidMinimum",
        ios_current AS "iosCurrent",
        ios_minimum AS "iosMinimum",
        release_notes AS "releaseNotes",
        force_update AS "forceUpdate",
        updated_at AS "updatedAt";
    `;

    const values = [
      androidCurrent,
      androidMinimum,
      iosCurrent,
      iosMinimum,
      releaseNotes || '',
      forceUpdate,
    ];

    // FIXED: Changed db.query to pool.query
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
}

export default AppSettingModel;