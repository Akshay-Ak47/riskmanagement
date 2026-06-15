use rusqlite::{Connection, params};

use crate::models::risk_history_model::RiskHistoryModel;
use crate::services::calculation_services::get_current_timestamp;

pub fn insert_risk_history(
    conn: &Connection,
    history: &RiskHistoryModel
) -> Result<(), String> {

    conn.execute(
        "
        INSERT INTO risk_history (

            record_key,
            record_type,
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
            submitted_by,
            deleted_at,
            deleted_by

        )
        VALUES (

            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?

        )
        ",
        params![

            &history.record_key,
            &history.record_type,
            &history.parent_issue_key,
            &history.version_no,
            &history.summary,
            &history.status,
            &history.risk_group,
            &history.wbs_element,
            &history.attached_document_path,
            &history.description,
            &history.risk_probability,
            &history.risk_consequence,
            &history.greatest_risk_consequence,
            &history.risk_justification,
            &history.risk_response_strategy,
            &history.risk_response_actions,
            &history.residual_risk_probability,
            &history.residual_risk_consequence,
            &history.residual_risk_justification,
            &history.risk_scope,
            &history.risk_consequence_scope,
            &history.risk_cost,
            &history.risk_consequence_cost,
            &history.risk_schedule_start,
            &history.risk_schedule_end,
            &history.risk_consequence_schedule,
            &history.residual_risk_consequence_cost,
            &history.residual_risk_consequence_schedule,
            &history.residual_risk_consequence_scope,
            &history.comment,
            &history.created_at,
            &history.risk_owner_name,
            &history.submitted_by,
            &history.deleted_at,
            &history.deleted_by
        ]
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_all_history(
    conn: &Connection
) -> Result<Vec<RiskHistoryModel>, String> {

    let mut stmt =
        conn
            .prepare(
                "
                SELECT
                    record_key,
                    record_type,
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
                    submitted_by,
                    deleted_at,
                    deleted_by
                FROM risk_history
                ORDER BY
                    COALESCE(parent_issue_key, record_key),
                    CASE
                        WHEN record_type = 'MAIN_RISK' THEN 0
                        ELSE 1
                    END,
                    version_no
                "
            )
            .map_err(|e| e.to_string())?;

    let history =
        stmt
            .query_map(
                [],
                |row| {

                    Ok(
                        RiskHistoryModel {

                            record_key: row.get(0)?,
                            record_type: row.get(1)?,
                            parent_issue_key: row.get(2)?,
                            version_no: row.get(3)?,

                            summary: row.get(4)?,
                            status: row.get(5)?,
                            risk_group: row.get(6)?,
                            wbs_element: row.get(7)?,
                            attached_document_path: row.get(8)?,
                            description: row.get(9)?,

                            risk_probability: row.get(10)?,
                            risk_consequence: row.get(11)?,
                            greatest_risk_consequence: row.get(12)?,
                            risk_justification: row.get(13)?,
                            risk_response_strategy: row.get(14)?,
                            risk_response_actions: row.get(15)?,

                            residual_risk_probability: row.get(16)?,
                            residual_risk_consequence: row.get(17)?,
                            residual_risk_justification: row.get(18)?,

                            risk_scope: row.get(19)?,
                            risk_consequence_scope: row.get(20)?,
                            risk_cost: row.get(21)?,
                            risk_consequence_cost: row.get(22)?,

                            risk_schedule_start: row.get(23)?,
                            risk_schedule_end: row.get(24)?,
                            risk_consequence_schedule: row.get(25)?,

                            residual_risk_consequence_cost: row.get(26)?,
                            residual_risk_consequence_schedule: row.get(27)?,
                            residual_risk_consequence_scope: row.get(28)?,

                            comment: row.get(29)?,
                            created_at: row.get(30)?,
                            risk_owner_name: row.get(31)?,
                            submitted_by: row.get(32)?,

                            deleted_at: row.get(33)?,
                            deleted_by: row.get(34)?
                        }
                    )
                }
            )
            .map_err(|e| e.to_string())?;

    let mut result = Vec::new();

    for item in history {

        result.push(
            item.map_err(|e| e.to_string())?
        );
    }

    Ok(result)
}