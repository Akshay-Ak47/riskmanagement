use rusqlite::Connection;

use crate::repositories::{
    risk_repository,
    risk_version_repository,
    risk_history_repository
};

use crate::services::risk_history_service;

pub fn delete_item_with_history(
    conn: &mut Connection,
    key: &str,
    deleted_by: &str
) -> Result<String, String> {

    let tx =
        conn
            .transaction()
            .map_err(|e| e.to_string())?;

    if let Ok(version) =
        risk_version_repository
            ::get_risk_version_by_key(
                &tx,
                key
            )
    {

        let history =
            risk_history_service
                ::create_history_from_version(
                    version,
                    deleted_by.to_string()
                );

        risk_history_repository
            ::insert_risk_history(
                &tx,
                &history
            )?;

        risk_version_repository
            ::delete_risk_version_by_key(
                &tx,
                key
            )?;

        tx.commit()
            .map_err(|e| e.to_string())?;

        return Ok(
            format!(
                "Version {} deleted successfully",
                key
            )
        );
    }

    let risk =
        risk_repository
            ::get_risk_by_key(
                &tx,
                key
            )?;

    let versions =
        risk_version_repository
            ::get_risk_versions_by_parent_key(
                &tx,
                key
            )?;

    let risk_history =
        risk_history_service
            ::create_history_from_risk(
                risk,
                deleted_by.to_string()
            );

    risk_history_repository
        ::insert_risk_history(
            &tx,
            &risk_history
        )?;

    for version in versions {

        let version_history =
            risk_history_service
                ::create_history_from_version(
                    version,
                    deleted_by.to_string()
                );

        risk_history_repository
            ::insert_risk_history(
                &tx,
                &version_history
            )?;
    }

    risk_repository
        ::delete_risk(
            &tx,
            key
        )?;

    tx.commit()
        .map_err(|e| e.to_string())?;

    Ok(
        format!(
            "Risk {} and all versions deleted successfully",
            key
        )
    )
}