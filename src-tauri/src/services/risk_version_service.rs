use rusqlite::Connection;
use crate::services::file_service;
use crate::repositories::risk_version_repository;

use crate::models::risk_model::Risk;
use crate::models::risk_version_model::RiskVersionModel;
use crate::repositories::risk_repository;


pub fn get_next_version_number(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<i32, String> {

    let max_version =
        risk_version_repository
            ::get_max_version_no(
                conn,
                parent_issue_key
            )?;

    Ok(
        match max_version {

            Some(version) =>
                version + 1,

            None =>
                1
        }
    )
}

pub fn build_version_key(
    parent_issue_key: &str,
    version_no: i32
) -> String {

    format!(
        "{}.{}",
        parent_issue_key,
        version_no
    )
}

pub fn create_risk_version(
    conn: &Connection,
    mut risk: Risk
) -> Result<(), String> {

   let key =
       risk
           .issue_key
           .clone()
           .ok_or(
               "Issue key missing"
           )?;

   let parent_issue_key =
       match risk_version_repository
           ::get_risk_version_by_key(
               conn,
               &key
           ) {

           Ok(version) => {

               version
                   .parent_issue_key
                   .clone()
                   .ok_or(
                       "Parent issue key missing"
                   )?
           }

           Err(_) => {

               key
           }
       };

    let version_no =
        get_next_version_number(
            conn,
            &parent_issue_key
        )?;

    let version_key =
        build_version_key(
            &parent_issue_key,
            version_no
        );

        println!(
            "ATTACHMENT PATH FROM REACT = {:?}",
            risk.attached_document_path
        );

        if let Some(path) =
            &risk.attached_document_path {

            if !path.is_empty()
                && !path.starts_with(
                    "C:\\RiskRegisterData\\Attachments"
                )
            {

                let copied_path =
                    file_service::copy_attachment(
                        path
                    )?;

                risk.attached_document_path =
                    Some(copied_path);
            }
        }

    let risk_version =
        RiskVersionModel {

            version_key:
                Some(version_key),

            parent_issue_key:
                Some(parent_issue_key),

            version_no:
                Some(version_no),

            summary:
                risk.summary,

            status:
                risk.status,

            risk_group:
                risk.risk_group,

            wbs_element:
                risk.wbs_element,

            attached_document_path:
                risk.attached_document_path,

            description:
                risk.description,

            risk_probability:
                risk.risk_probability,

            risk_consequence:
                risk.risk_consequence,

            greatest_risk_consequence:
                risk.greatest_risk_consequence,

            risk_justification:
                risk.risk_justification,

            risk_response_strategy:
                risk.risk_response_strategy,

            risk_response_actions:
                risk.risk_response_actions,

            residual_risk_probability:
                risk.residual_risk_probability,

            residual_risk_consequence:
                risk.residual_risk_consequence,

            residual_risk_justification:
                risk.residual_risk_justification,

            risk_scope:
                risk.risk_scope,

            risk_consequence_scope:
                risk.risk_consequence_scope,

            risk_cost:
                risk.risk_cost,

            risk_consequence_cost:
                risk.risk_consequence_cost,

            risk_schedule_start:
                risk.risk_schedule_start,

            risk_schedule_end:
                risk.risk_schedule_end,

            risk_consequence_schedule:
                risk.risk_consequence_schedule,

            residual_risk_consequence_cost:
                risk.residual_risk_consequence_cost,

            residual_risk_consequence_schedule:
                risk.residual_risk_consequence_schedule,

            residual_risk_consequence_scope:
                risk.residual_risk_consequence_scope,

            comment:
                risk.comment,

            created_at:
                risk.created_at,

            risk_owner_name:
                risk.risk_owner_name,

            submitted_by:
                risk.submitted_by
        };

    risk_version_repository
        ::insert_risk_version(
            conn,
            &risk_version
        )?;

    Ok(())
}


pub fn get_risk_versions_by_parent_key(
    conn: &Connection,
    parent_issue_key: &str
) -> Result<Vec<RiskVersionModel>, String> {

    risk_version_repository
        ::get_risk_versions_by_parent_key(
            conn,
            parent_issue_key
        )
}

#[derive(Debug, serde::Serialize)]
#[serde(untagged)]
pub enum EditableRisk {

    Risk(Risk),

    Version(RiskVersionModel)
}

pub fn get_editable_risk(
    conn: &Connection,
    key: &str
) -> Result<EditableRisk, String> {

    if let Ok(version) =
        risk_version_repository
            ::get_risk_version_by_key(
                conn,
                key
            )
    {
        return Ok(
            EditableRisk::Version(
                version
            )
        );
    }

    match risk_version_repository
        ::get_latest_version_by_parent_key(
            conn,
            key
        )? {

        Some(version) => {

            Ok(
                EditableRisk::Version(
                    version
                )
            )
        }

        None => {

            let risk =
                risk_repository
                    ::get_risk_by_key(
                        conn,
                        key
                    )?;

            Ok(
                EditableRisk::Risk(
                    risk
                )
            )
        }
    }
}

pub fn get_risk_version_by_key(
    conn: &Connection,
    version_key: &str
) -> Result<RiskVersionModel, String> {

    risk_version_repository
        ::get_risk_version_by_key(
            conn,
            version_key
        )
}