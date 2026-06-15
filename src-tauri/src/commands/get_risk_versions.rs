use tauri::Manager;

use crate::database::connection::create_connection;

use crate::models::risk_version_model::RiskVersionModel;

use crate::repositories::risk_version_repository;

#[tauri::command]
pub fn get_risk_versions(
    app: tauri::AppHandle,
    parent_issue_key: String
) -> Result<Vec<RiskVersionModel>, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let conn =
        create_connection(app_data_dir);

    risk_version_repository
        ::get_risk_versions_by_parent_key(
            &conn,
            &parent_issue_key
        )
}