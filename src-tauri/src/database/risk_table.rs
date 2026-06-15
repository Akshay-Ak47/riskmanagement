use rusqlite::Connection;

pub fn create_risks_table(conn: &Connection) {

    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS risks (

            issue_key TEXT PRIMARY KEY,

            summary TEXT,

            status TEXT,

            risk_group TEXT,

            wbs_element TEXT,

            attached_document_path TEXT,

            description TEXT,

            risk_probability TEXT,

            risk_consequence TEXT,

            greatest_risk_consequence TEXT,

            risk_justification TEXT,

            risk_response_strategy TEXT,

            risk_response_actions TEXT,

            residual_risk_probability TEXT,

            residual_risk_consequence TEXT,

            residual_risk_justification TEXT,

            risk_scope TEXT,

            risk_consequence_scope TEXT,

            risk_cost REAL,

            risk_consequence_cost TEXT,

            risk_schedule_start TEXT,

            risk_schedule_end TEXT,

            risk_consequence_schedule TEXT,

            residual_risk_consequence_cost TEXT,

            residual_risk_consequence_schedule TEXT,

            residual_risk_consequence_scope TEXT,

            comment TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            risk_owner_name TEXT,

            submitted_by TEXT

        )
        ",
        [],
    )
    .expect("Failed to create risks table");

    println!("Risk table ready");
}