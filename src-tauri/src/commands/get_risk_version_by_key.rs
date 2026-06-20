use crate::database::connection::create_connection;

use crate::services::risk_version_service;

use crate::models::risk_version_model::RiskVersionModel;

use tauri::Manager;

#[tauri::command]
pub fn get_risk_version_by_key(
    app: tauri::AppHandle,
    version_key: String
) -> Result<RiskVersionModel, String> {

    let app_data_dir =
        app
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?;

    let conn =
        create_connection(
            app_data_dir
        );

    risk_version_service
        ::get_risk_version_by_key(
            &conn,
            &version_key
        )
}