use tauri::Manager;

use crate::database::connection::create_connection;

use crate::models::risk_model::Risk;

use crate::repositories::risk_repository;

#[tauri::command]
pub fn get_risks(
    app: tauri::AppHandle
) -> Result<Vec<Risk>, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let conn =
        create_connection(app_data_dir);

    risk_repository::get_all_risks(&conn)
}