use rusqlite::Connection;

use crate::models::risk_model::Risk;

pub fn get_all_risks(
    conn: &Connection
) -> Result<Vec<Risk>, String> {

    let mut stmt = conn
        .prepare(
            "
            SELECT
                issue_key,
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
            FROM risks
            "
        )
        .map_err(|e| e.to_string())?;

    let risks = stmt
        .query_map([], |row| {

            Ok(Risk {

                issue_key: row.get(0)?,
                summary: row.get(1)?,
                status: row.get(2)?,
                risk_group: row.get(3)?,
                wbs_element: row.get(4)?,
                attached_document_path: row.get(5)?,
                description: row.get(6)?,
                risk_probability: row.get(7)?,
                risk_consequence: row.get(8)?,
                greatest_risk_consequence: row.get(9)?,
                risk_justification: row.get(10)?,
                risk_response_strategy: row.get(11)?,
                risk_response_actions: row.get(12)?,
                residual_risk_probability: row.get(13)?,
                residual_risk_consequence: row.get(14)?,
                residual_risk_justification: row.get(15)?,
                risk_scope: row.get(16)?,
                risk_consequence_scope: row.get(17)?,
                risk_cost: row.get(18)?,
                risk_consequence_cost: row.get(19)?,
                risk_schedule_start: row.get(20)?,
                risk_schedule_end: row.get(21)?,
                risk_consequence_schedule: row.get(22)?,
                residual_risk_consequence_cost: row.get(23)?,
                residual_risk_consequence_schedule: row.get(24)?,
                residual_risk_consequence_scope: row.get(25)?,
                comment: row.get(26)?,
                created_at: row.get(27)?,
                risk_owner_name: row.get(28)?,
                submitted_by: row.get(29)?
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(
        risks
            .filter_map(Result::ok)
            .collect()
    )
}

pub fn delete_risk(
    conn: &Connection,
    issue_key: &str
) -> Result<(), String> {

    conn.execute(
        "
        DELETE FROM risks
        WHERE issue_key = ?
        ",
        [issue_key]
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn get_risk_by_key(
    conn: &Connection,
    issue_key: &str
) -> Result<Risk, String> {

    let mut stmt = conn
        .prepare(
            "
            SELECT
                issue_key,
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
            FROM risks
            WHERE issue_key = ?
            "
        )
        .map_err(|e| e.to_string())?;

    let risk = stmt
        .query_row(
            [issue_key],
            |row| {

                Ok(Risk {

                    issue_key: row.get(0)?,
                    summary: row.get(1)?,
                    status: row.get(2)?,
                    risk_group: row.get(3)?,
                    wbs_element: row.get(4)?,
                    attached_document_path: row.get(5)?,
                    description: row.get(6)?,
                    risk_probability: row.get(7)?,
                    risk_consequence: row.get(8)?,
                    greatest_risk_consequence: row.get(9)?,
                    risk_justification: row.get(10)?,
                    risk_response_strategy: row.get(11)?,
                    risk_response_actions: row.get(12)?,
                    residual_risk_probability: row.get(13)?,
                    residual_risk_consequence: row.get(14)?,
                    residual_risk_justification: row.get(15)?,
                    risk_scope: row.get(16)?,
                    risk_consequence_scope: row.get(17)?,
                    risk_cost: row.get(18)?,
                    risk_consequence_cost: row.get(19)?,
                    risk_schedule_start: row.get(20)?,
                    risk_schedule_end: row.get(21)?,
                    risk_consequence_schedule: row.get(22)?,
                    residual_risk_consequence_cost: row.get(23)?,
                    residual_risk_consequence_schedule: row.get(24)?,
                    residual_risk_consequence_scope: row.get(25)?,
                    comment: row.get(26)?,
                    created_at: row.get(27)?,
                    risk_owner_name: row.get(28)?,
                    submitted_by: row.get(29)?
                })
            }
        )
        .map_err(|e| e.to_string())?;

    Ok(risk)
}