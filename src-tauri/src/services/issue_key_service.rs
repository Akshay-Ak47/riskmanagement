use rusqlite::Connection;

pub fn generate_issue_key(
    conn: &Connection
) -> String {

    let max_number: i32 = conn
        .query_row(
            "
            SELECT COALESCE(
                MAX(
                    CAST(
                        REPLACE(base_key, 'RISK-', '')
                        AS INTEGER
                    )
                ),
                0
            )
            FROM (

                SELECT issue_key AS base_key
                FROM risks

                UNION ALL

                SELECT
                    CASE
                        WHEN INSTR(record_key, '.') > 0
                        THEN SUBSTR(
                            record_key,
                            1,
                            INSTR(record_key, '.') - 1
                        )
                        ELSE record_key
                    END AS base_key
                FROM risk_history

            )
            ",
            [],
            |row| row.get(0)
        )
        .unwrap_or(0);

    println!("MAX NUMBER = {}", max_number);

    let next_number = max_number + 1;

    println!("NEXT NUMBER = {}", next_number);

    format!(
        "RISK-{:03}",
        next_number
    )
}