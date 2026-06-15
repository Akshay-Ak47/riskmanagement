use tauri::Manager;

use super::connection::create_connection;
use super::product_table::create_products_table;
use super::risk_table::create_risks_table;
use super::risk_version_table::create_risk_versions_table;
use super::risk_history_table::create_risk_history_table;

pub fn initialize_database(app: &tauri::App) {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");

    std::fs::create_dir_all(&app_data_dir)
        .expect("Failed to create app data directory");

    let conn = create_connection(app_data_dir);

    create_products_table(&conn);

    create_risks_table(&conn);
    create_risk_versions_table(&conn);
    create_risk_history_table(&conn);

    println!("Database initialized");
}