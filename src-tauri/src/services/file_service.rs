use std::fs;
use std::path::Path;

pub fn copy_attachment(
    source_path: &str,
) -> Result<String, String> {

    println!(
        "================================="
    );

    println!(
        "SOURCE PATH RECEIVED = {}",
        source_path
    );

    println!(
        "FILE EXISTS = {}",
        Path::new(source_path).exists()
    );

    println!(
        "IS FILE = {}",
        Path::new(source_path).is_file()
    );

    let destination_folder =
        "C:\\RiskRegisterData\\Attachments";

    println!(
        "DESTINATION FOLDER = {}",
        destination_folder
    );

    fs::create_dir_all(
        destination_folder
    )
    .map_err(|e| e.to_string())?;

    let file_name =
        Path::new(source_path)
            .file_name()
            .ok_or(
                "Invalid file name"
            )?;

    println!(
        "FILE NAME = {:?}",
        file_name
    );

    let destination_path =
        Path::new(
            destination_folder
        )
        .join(file_name);

    println!(
        "DESTINATION PATH = {}",
        destination_path
            .to_string_lossy()
    );

    fs::copy(
        source_path,
        &destination_path
    )
    .map_err(|e| {

        println!(
            "COPY ERROR = {}",
            e
        );

        e.to_string()

    })?;

    println!(
        "COPIED FILE PATH = {}",
        destination_path
            .to_string_lossy()
    );

    println!(
        "================================="
    );

    Ok(
        destination_path
            .to_string_lossy()
            .to_string()
    )
}

pub fn open_attachment(
    file_path: &str,
) -> Result<(), String> {

    let path =
        Path::new(file_path);

    if !path.exists() {

        return Err(
            format!(
                "File not found: {}",
                file_path
            )
        );
    }

    if !path.is_file() {

        return Err(
            format!(
                "Invalid file: {}",
                file_path
            )
        );
    }

    println!(
        "OPENING FILE = {}",
        file_path
    );

    open::that(path)
        .map_err(|e| {

            format!(
                "Failed to open file: {}",
                e
            )

        })?;

    Ok(())
}