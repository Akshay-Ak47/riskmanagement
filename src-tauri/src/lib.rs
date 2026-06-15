mod database;
mod commands;
mod models;
mod services;
mod repositories;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

  tauri::Builder::default()  .plugin(
                                   tauri_plugin_dialog::init()
                               )

      .invoke_handler(tauri::generate_handler![
          commands::product_commands::add_product,
          commands::risk_commands::create_risk,
          commands::delete_risk::delete_risk,
          commands::get_risks::get_risks,
          commands::create_risk_version::create_risk_version,
          commands::get_risk_by_key::get_risk_by_key,
          commands::get_risk_versions::get_risk_versions,
          commands::get_editable_risk::get_editable_risk,
          commands::risk_history_command::get_all_history,
          commands::open_document::open_document,


      ])

      .setup(|app| {

        database::init::initialize_database(app);

        if cfg!(debug_assertions) {

          app.handle().plugin(
            tauri_plugin_log::Builder::default()
              .level(log::LevelFilter::Info)
              .build(),
          )?;
        }

        Ok(())
      })

      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}