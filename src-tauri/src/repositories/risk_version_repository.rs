use rusqlite::Connection;
use rusqlite::params;
use crate::services::file_service;

use crate::models::risk_version_model::RiskVersionModel;
use crate::services::calculation_services::get_current_timestamp;

pub fn get_max_version_no(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<Option<i32>, String> {

    let version_no: Option<i32> =
        conn.query_row(
            "
            SELECT
                MAX(version_no)
            FROM risk_versions
            WHERE parent_issue_key = ?
            ",
            [parent_issue_key],
            |row| row.get(0)
        )
        .unwrap_or(None);

    Ok(version_no)
}

pub fn insert_risk_version(
    conn: &Connection,
    risk_version: &RiskVersionModel
) -> Result<(), String> {

    let timestamp = get_current_timestamp();

    conn.execute(
        "
        INSERT INTO risk_versions (

            version_key,
            parent_issue_key,
            version_no,
            summary,
            status,
            risk_group,
            wbs_element,
            attached_document_path,
            description,
            risk_probability,
            risk_consequence,
            greatest_risk_consequence,
            risk_justification,
            risk_response_strategy,
            risk_response_actions,
            residual_risk_probability,
            residual_risk_consequence,
            residual_risk_justification,
            risk_scope,
            risk_consequence_scope,
            risk_cost,
            risk_consequence_cost,
            risk_schedule_start,
            risk_schedule_end,
            risk_consequence_schedule,
            residual_risk_consequence_cost,
            residual_risk_consequence_schedule,
            residual_risk_consequence_scope,
            comment,
            created_at,
            risk_owner_name,
            submitted_by

        )
        VALUES (

            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?,?

        )
        ",
        params![
            &risk_version.version_key,
            &risk_version.parent_issue_key,
            &risk_version.version_no,
            &risk_version.summary,
            &risk_version.status,
            &risk_version.risk_group,
            &risk_version.wbs_element,
            &risk_version.attached_document_path,
            &risk_version.description,
            &risk_version.risk_probability,
            &risk_version.risk_consequence,
            &risk_version.greatest_risk_consequence,
            &risk_version.risk_justification,
            &risk_version.risk_response_strategy,
            &risk_version.risk_response_actions,
            &risk_version.residual_risk_probability,
            &risk_version.residual_risk_consequence,
            &risk_version.residual_risk_justification,
            &risk_version.risk_scope,
            &risk_version.risk_consequence_scope,
            &risk_version.risk_cost,
            &risk_version.risk_consequence_cost,
            &risk_version.risk_schedule_start,
            &risk_version.risk_schedule_end,
            &risk_version.risk_consequence_schedule,
            &risk_version.residual_risk_consequence_cost,
            &risk_version.residual_risk_consequence_schedule,
            &risk_version.residual_risk_consequence_scope,
            &risk_version.comment,
            &timestamp,
            &risk_version.risk_owner_name,
            &risk_version.submitted_by
        ]
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_risk_versions(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<Vec<RiskVersionModel>, String> {

    let _ = parent_issue_key;

    Ok(vec![])
}


pub fn get_risk_versions_by_parent_key(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<Vec<RiskVersionModel>, String> {

    let mut stmt = conn
        .prepare(
            "
            SELECT
                version_key,
                parent_issue_key,
                version_no,
                summary,
                status,
                risk_group,
                wbs_element,
                attached_document_path,
                description,
                risk_probability,
                risk_consequence,
                greatest_risk_consequence,
                risk_justification,
                risk_response_strategy,
                risk_response_actions,
                residual_risk_probability,
                residual_risk_consequence,
                residual_risk_justification,
                risk_scope,
                risk_consequence_scope,
                risk_cost,
                risk_consequence_cost,
                risk_schedule_start,
                risk_schedule_end,
                risk_consequence_schedule,
                residual_risk_consequence_cost,
                residual_risk_consequence_schedule,
                residual_risk_consequence_scope,
                comment,
                created_at,
                risk_owner_name,
                submitted_by
            FROM risk_versions
            WHERE parent_issue_key = ?
            ORDER BY version_no DESC
            "
        )
        .map_err(|e| e.to_string())?;

    let versions = stmt
        .query_map(
            [parent_issue_key],
            |row| {

                Ok(RiskVersionModel {

                    version_key: row.get(0)?,
                    parent_issue_key: row.get(1)?,
                    version_no: row.get(2)?,

                    summary: row.get(3)?,
                    status: row.get(4)?,
                    risk_group: row.get(5)?,
                    wbs_element: row.get(6)?,
                    attached_document_path: row.get(7)?,
                    description: row.get(8)?,
                    risk_probability: row.get(9)?,
                    risk_consequence: row.get(10)?,
                    greatest_risk_consequence: row.get(11)?,
                    risk_justification: row.get(12)?,
                    risk_response_strategy: row.get(13)?,
                    risk_response_actions: row.get(14)?,
                    residual_risk_probability: row.get(15)?,
                    residual_risk_consequence: row.get(16)?,
                    residual_risk_justification: row.get(17)?,
                    risk_scope: row.get(18)?,
                    risk_consequence_scope: row.get(19)?,
                    risk_cost: row.get(20)?,
                    risk_consequence_cost: row.get(21)?,
                    risk_schedule_start: row.get(22)?,
                    risk_schedule_end: row.get(23)?,
                    risk_consequence_schedule: row.get(24)?,
                    residual_risk_consequence_cost: row.get(25)?,
                    residual_risk_consequence_schedule: row.get(26)?,
                    residual_risk_consequence_scope: row.get(27)?,
                    comment: row.get(28)?,
                    created_at: row.get(29)?,
                    risk_owner_name: row.get(30)?,
                    submitted_by: row.get(31)?
                })
            }
        )
        .map_err(|e| e.to_string())?;

    Ok(
        versions
            .filter_map(Result::ok)
            .collect()
    )
}
pub fn get_latest_version_by_parent_key(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<Option<RiskVersionModel>, String> {

    let mut stmt = conn
        .prepare(
            "
            SELECT
                version_key,
                parent_issue_key,
                version_no,
                summary,
                status,
                risk_group,
                wbs_element,
                attached_document_path,
                description,
                risk_probability,
                risk_consequence,
                greatest_risk_consequence,
                risk_justification,
                risk_response_strategy,
                risk_response_actions,
                residual_risk_probability,
                residual_risk_consequence,
                residual_risk_justification,
                risk_scope,
                risk_consequence_scope,
                risk_cost,
                risk_consequence_cost,
                risk_schedule_start,
                risk_schedule_end,
                risk_consequence_schedule,
                residual_risk_consequence_cost,
                residual_risk_consequence_schedule,
                residual_risk_consequence_scope,
                comment,
                created_at,
                risk_owner_name,
                submitted_by
            FROM risk_versions
            WHERE parent_issue_key = ?
            ORDER BY version_no DESC
            LIMIT 1
            "
        )
        .map_err(|e| e.to_string())?;

    let result = stmt.query_row(
        [parent_issue_key],
        |row| {

            Ok(RiskVersionModel {

                version_key: row.get(0)?,
                parent_issue_key: row.get(1)?,
                version_no: row.get(2)?,

                summary: row.get(3)?,
                status: row.get(4)?,
                risk_group: row.get(5)?,
                wbs_element: row.get(6)?,
                attached_document_path: row.get(7)?,
                description: row.get(8)?,
                risk_probability: row.get(9)?,
                risk_consequence: row.get(10)?,
                greatest_risk_consequence: row.get(11)?,
                risk_justification: row.get(12)?,
                risk_response_strategy: row.get(13)?,
                risk_response_actions: row.get(14)?,
                residual_risk_probability: row.get(15)?,
                residual_risk_consequence: row.get(16)?,
                residual_risk_justification: row.get(17)?,
                risk_scope: row.get(18)?,
                risk_consequence_scope: row.get(19)?,
                risk_cost: row.get(20)?,
                risk_consequence_cost: row.get(21)?,
                risk_schedule_start: row.get(22)?,
                risk_schedule_end: row.get(23)?,
                risk_consequence_schedule: row.get(24)?,
                residual_risk_consequence_cost: row.get(25)?,
                residual_risk_consequence_schedule: row.get(26)?,
                residual_risk_consequence_scope: row.get(27)?,
                comment: row.get(28)?,
                created_at: row.get(29)?,
                risk_owner_name: row.get(30)?,
                submitted_by: row.get(31)?
            })
        }
    );

    match result {

        Ok(version) =>
            Ok(Some(version)),

        Err(rusqlite::Error::QueryReturnedNoRows) =>
            Ok(None),

        Err(e) =>
            Err(e.to_string())
    }
}

pub fn get_risk_version_by_key(
    conn: &Connection,
    version_key: &str
) -> Result<RiskVersionModel, String> {

    let mut stmt = conn
        .prepare(
            "
            SELECT
                version_key,
                parent_issue_key,
                version_no,
                summary,
                status,
                risk_group,
                wbs_element,
                attached_document_path,
                description,
                risk_probability,
                risk_consequence,
                greatest_risk_consequence,
                risk_justification,
                risk_response_strategy,
                risk_response_actions,
                residual_risk_probability,
                residual_risk_consequence,
                residual_risk_justification,
                risk_scope,
                risk_consequence_scope,
                risk_cost,
                risk_consequence_cost,
                risk_schedule_start,
                risk_schedule_end,
                risk_consequence_schedule,
                residual_risk_consequence_cost,
                residual_risk_consequence_schedule,
                residual_risk_consequence_scope,
                comment,
                created_at,
                risk_owner_name,
                submitted_by
            FROM risk_versions
            WHERE version_key = ?
            "
        )
        .map_err(|e| e.to_string())?;

    let version = stmt
        .query_row(
            [version_key],
            |row| {
                Ok(RiskVersionModel {

                    version_key: row.get(0)?,
                    parent_issue_key: row.get(1)?,
                    version_no: row.get(2)?,

                    summary: row.get(3)?,
                    status: row.get(4)?,
                    risk_group: row.get(5)?,
                    wbs_element: row.get(6)?,
                    attached_document_path: row.get(7)?,
                    description: row.get(8)?,
                    risk_probability: row.get(9)?,
                    risk_consequence: row.get(10)?,
                    greatest_risk_consequence: row.get(11)?,
                    risk_justification: row.get(12)?,
                    risk_response_strategy: row.get(13)?,
                    risk_response_actions: row.get(14)?,
                    residual_risk_probability: row.get(15)?,
                    residual_risk_consequence: row.get(16)?,
                    residual_risk_justification: row.get(17)?,
                    risk_scope: row.get(18)?,
                    risk_consequence_scope: row.get(19)?,
                    risk_cost: row.get(20)?,
                    risk_consequence_cost: row.get(21)?,
                    risk_schedule_start: row.get(22)?,
                    risk_schedule_end: row.get(23)?,
                    risk_consequence_schedule: row.get(24)?,
                    residual_risk_consequence_cost: row.get(25)?,
                    residual_risk_consequence_schedule: row.get(26)?,
                    residual_risk_consequence_scope: row.get(27)?,
                    comment: row.get(28)?,
                    created_at: row.get(29)?,
                    risk_owner_name: row.get(30)?,
                    submitted_by: row.get(31)?
                })
            }
        )
        .map_err(|e| e.to_string())?;

    Ok(version)
}

pub fn delete_risk_version_by_key(
    conn: &Connection,
    version_key: &str
) -> Result<(), String> {

    let rows_deleted =
        conn.execute(
            "
            DELETE FROM risk_versions
            WHERE version_key = ?
            ",
            [version_key]
        )
        .map_err(|e| e.to_string())?;

    if rows_deleted == 0 {

        return Err(
            format!(
                "Version {} not found",
                version_key
            )
        );
    }

    Ok(())
}