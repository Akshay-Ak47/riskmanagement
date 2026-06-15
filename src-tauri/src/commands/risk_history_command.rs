use crate::database::connection::create_connection;
use crate::models::risk_history_model::RiskHistoryModel;
use crate::services::risk_history_service;

use tauri::Manager;

#[tauri::command]
pub fn get_all_history(
    app: tauri::AppHandle
) -> Result<Vec<RiskHistoryModel>, String> {

    let app_data_dir =
        app
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?;

    let conn =
        create_connection(
            app_data_dir
        );

    risk_history_service
        ::get_all_history(
            &conn
        )
}