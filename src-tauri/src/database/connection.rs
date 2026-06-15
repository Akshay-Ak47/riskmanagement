use rusqlite::Connection;

use std::path::PathBuf;

pub fn create_connection(app_data_dir: PathBuf) -> Connection {

    let db_path = app_data_dir.join("risk_register_db.db");

    Connection::open(db_path)
        .expect("Failed to open database")
}