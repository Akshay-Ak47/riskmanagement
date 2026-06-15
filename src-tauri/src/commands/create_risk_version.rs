use tauri::Manager;

use crate::database::connection::create_connection;

use crate::models::risk_model::Risk;

use crate::services::risk_version_service;

#[tauri::command]
pub fn create_risk_version(
    app: tauri::AppHandle,
    risk: Risk
) -> Result<String, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let conn =
        create_connection(app_data_dir);

    risk_version_service
        ::create_risk_version(
            &conn,
            risk
        )?;

    Ok(
        String::from(
            "Risk version created successfully"
        )
    )
}