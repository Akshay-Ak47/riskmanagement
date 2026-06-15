use rusqlite::params;

use tauri::Manager;

use crate::database::connection::create_connection;
use crate::models::risk_model::Risk;
use crate::services::issue_key_service::generate_issue_key;
use crate::services::file_service;
use crate::services::calculation_services::get_current_timestamp;

#[tauri::command]
pub fn create_risk(

    app: tauri::AppHandle,

    mut risk: Risk,

) -> Result<String, String> {

    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let conn = create_connection(app_data_dir);

    let issue_key = generate_issue_key(&conn);

    risk.issue_key = Some(issue_key.clone());

    risk.created_at =  Some(get_current_timestamp()    );

   println!(
       "ATTACHMENT PATH FROM REACT = {:?}",
       risk.attached_document_path
   );

   if let Some(path) =
       &risk.attached_document_path {

       println!(
           "PATH VALUE = {}",
           path
       );

       if !path.is_empty() {

           let copied_path =
               file_service::copy_attachment(
                   path
               )?;

           risk.attached_document_path =
               Some(copied_path);
       }
   }

    conn.execute(
        "
        INSERT INTO risks (

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

            risk_owner_name,

            submitted_by,
            created_at

        )
        VALUES (

            ?1, ?2, ?3, ?4, ?5,
            ?6, ?7, ?8, ?9, ?10,
            ?11, ?12, ?13, ?14, ?15,
            ?16, ?17, ?18, ?19, ?20,
            ?21, ?22, ?23, ?24, ?25,
            ?26, ?27, ?28, ?29, ?30

        )
        ",
        params![

            risk.issue_key,

            risk.summary,

            risk.status,

            risk.risk_group,

            risk.wbs_element,

            risk.attached_document_path,

            risk.description,

            risk.risk_probability,

            risk.risk_consequence,

            risk.greatest_risk_consequence,

            risk.risk_justification,

            risk.risk_response_strategy,

            risk.risk_response_actions,

            risk.residual_risk_probability,

            risk.residual_risk_consequence,

            risk.residual_risk_justification,

            risk.risk_scope,

            risk.risk_consequence_scope,

            risk.risk_cost,

            risk.risk_consequence_cost,

            risk.risk_schedule_start,

            risk.risk_schedule_end,

            risk.risk_consequence_schedule,

            risk.residual_risk_consequence_cost,

            risk.residual_risk_consequence_schedule,

            risk.residual_risk_consequence_scope,

            risk.comment,

            risk.risk_owner_name,

            risk.submitted_by,
            risk.created_at

        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(format!("Risk created successfully: {}", issue_key))
}