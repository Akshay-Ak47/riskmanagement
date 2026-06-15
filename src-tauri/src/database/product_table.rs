use rusqlite::Connection;

pub fn create_products_table(conn: &Connection) {

    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS products (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            quantity INTEGER,

            price REAL

        )
        ",
        [],
    )
    .expect("Failed to create products table");

    println!("Products table ready");
}