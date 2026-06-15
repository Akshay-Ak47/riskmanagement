use crate::services::file_service;

#[tauri::command]
pub fn open_document(
    path: String,
) -> Result<(), String> {

    file_service::open_attachment(
        &path
    )
}