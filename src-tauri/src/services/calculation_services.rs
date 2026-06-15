use chrono::Local;

pub fn get_current_timestamp() -> String {

    Local::now()
        .format("%Y-%m-%d %H:%M:%S")
        .to_string()
}