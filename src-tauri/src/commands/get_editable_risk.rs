use tauri::Manager;

use crate::database::connection::create_connection;
use crate::services::risk_version_service::{self, EditableRisk};

#[tauri::command]
pub fn get_editable_risk(
    app: tauri::AppHandle,
    key: String
) -> Result<EditableRisk, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let conn =
        create_connection(app_data_dir);

    risk_version_service
        ::get_editable_risk(
            &conn,
            &key
        )
}