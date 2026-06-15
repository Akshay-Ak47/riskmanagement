use crate::database::connection::create_connection;
use crate::services::delete_risk_service;

use tauri::Manager;

#[tauri::command]
pub fn delete_risk(
    app: tauri::AppHandle,
    issue_key: String,
      deleted_by: String,
) -> Result<String, String> {

    let app_data_dir =
        app
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?;

    let mut conn =
        create_connection(
            app_data_dir
        );

    delete_risk_service
        ::delete_item_with_history(
            &mut conn,
            &issue_key,
             &deleted_by,
        )
}