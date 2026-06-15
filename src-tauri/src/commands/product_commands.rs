use rusqlite::params;

use tauri::Manager;

use crate::database::connection::create_connection;

#[tauri::command]
pub fn add_product(

    app: tauri::AppHandle,

    name: String,

    quantity: i32,

    price: f64,

) -> Result<String, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    println!("{:?}", app_data_dir);

    let conn = create_connection(app_data_dir);

    conn.execute(
        "
        INSERT INTO products (name, quantity, price)
        VALUES (?1, ?2, ?3)
        ",
        params![name, quantity, price],
    )
    .map_err(|e| e.to_string())?;

    Ok("Product added successfully".to_string())
}