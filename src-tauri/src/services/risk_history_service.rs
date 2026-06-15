use crate::models::risk_model::Risk;
use crate::models::risk_version_model::RiskVersionModel;
use crate::models::risk_history_model::RiskHistoryModel;
use crate::services::calculation_services;
use rusqlite::Connection;
use crate::repositories::risk_history_repository;

pub fn create_history_from_risk(
    risk: Risk,
    deleted_by: String
) -> RiskHistoryModel {

    RiskHistoryModel {

        record_key: risk.issue_key,
        record_type: Some("MAIN_RISK".to_string()),
        parent_issue_key: None,
        version_no: None,

        summary: risk.summary,
        status: risk.status,
        risk_group: risk.risk_group,
        wbs_element: risk.wbs_element,
        attached_document_path: risk.attached_document_path,
        description: risk.description,
        risk_probability: risk.risk_probability,
        risk_consequence: risk.risk_consequence,
        greatest_risk_consequence: risk.greatest_risk_consequence,
        risk_justification: risk.risk_justification,
        risk_response_strategy: risk.risk_response_strategy,
        risk_response_actions: risk.risk_response_actions,
        residual_risk_probability: risk.residual_risk_probability,
        residual_risk_consequence: risk.residual_risk_consequence,
        residual_risk_justification: risk.residual_risk_justification,
        risk_scope: risk.risk_scope,
        risk_consequence_scope: risk.risk_consequence_scope,
        risk_cost: risk.risk_cost,
        risk_consequence_cost: risk.risk_consequence_cost,
        risk_schedule_start: risk.risk_schedule_start,
        risk_schedule_end: risk.risk_schedule_end,
        risk_consequence_schedule: risk.risk_consequence_schedule,
        residual_risk_consequence_cost: risk.residual_risk_consequence_cost,
        residual_risk_consequence_schedule: risk.residual_risk_consequence_schedule,
        residual_risk_consequence_scope: risk.residual_risk_consequence_scope,
        comment: risk.comment,
        created_at: risk.created_at,
        risk_owner_name: risk.risk_owner_name,
        submitted_by: risk.submitted_by,

        deleted_at: Some(
            calculation_services::get_current_timestamp()
        ),

        deleted_by: Some(deleted_by)
    }
}

pub fn create_history_from_version(
    version: RiskVersionModel,
    deleted_by: String
) -> RiskHistoryModel {

    RiskHistoryModel {

        record_key: version.version_key,
        record_type: Some("VERSION".to_string()),
        parent_issue_key: version.parent_issue_key,
        version_no: version.version_no,

        summary: version.summary,
        status: version.status,
        risk_group: version.risk_group,
        wbs_element: version.wbs_element,
        attached_document_path: version.attached_document_path,
        description: version.description,
        risk_probability: version.risk_probability,
        risk_consequence: version.risk_consequence,
        greatest_risk_consequence: version.greatest_risk_consequence,
        risk_justification: version.risk_justification,
        risk_response_strategy: version.risk_response_strategy,
        risk_response_actions: version.risk_response_actions,
        residual_risk_probability: version.residual_risk_probability,
        residual_risk_consequence: version.residual_risk_consequence,
        residual_risk_justification: version.residual_risk_justification,
        risk_scope: version.risk_scope,
        risk_consequence_scope: version.risk_consequence_scope,
        risk_cost: version.risk_cost,
        risk_consequence_cost: version.risk_consequence_cost,
        risk_schedule_start: version.risk_schedule_start,
        risk_schedule_end: version.risk_schedule_end,
        risk_consequence_schedule: version.risk_consequence_schedule,
        residual_risk_consequence_cost: version.residual_risk_consequence_cost,
        residual_risk_consequence_schedule: version.residual_risk_consequence_schedule,
        residual_risk_consequence_scope: version.residual_risk_consequence_scope,
        comment: version.comment,
        created_at: version.created_at,
        risk_owner_name: version.risk_owner_name,
        submitted_by: version.submitted_by,

        deleted_at: Some(
            calculation_services::get_current_timestamp()
        ),

        deleted_by: Some(deleted_by)
    }
}

pub fn get_all_history(
    conn: &Connection
) -> Result<Vec<RiskHistoryModel>, String> {

    risk_history_repository
        ::get_all_history(conn)
}