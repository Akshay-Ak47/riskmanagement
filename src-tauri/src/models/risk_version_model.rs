#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct RiskVersionModel {
    pub version_key: Option<String>,

    pub parent_issue_key: Option<String>,

    pub version_no: Option<i32>,


    pub summary: Option<String>,

    pub status: Option<String>,

    pub risk_group: Option<String>,

    pub wbs_element: Option<String>,

    pub attached_document_path: Option<String>,

    pub description: Option<String>,

    pub risk_probability: Option<String>,

    pub risk_consequence: Option<String>,

    pub greatest_risk_consequence: Option<String>,

    pub risk_justification: Option<String>,

    pub risk_response_strategy: Option<String>,

    pub risk_response_actions: Option<String>,

    pub residual_risk_probability: Option<String>,

    pub residual_risk_consequence: Option<String>,

    pub residual_risk_justification: Option<String>,

    pub risk_scope: Option<String>,

    pub risk_consequence_scope: Option<String>,

    pub risk_cost: Option<f64>,

    pub risk_consequence_cost: Option<String>,

    pub risk_schedule_start: Option<String>,

    pub risk_schedule_end: Option<String>,

    pub risk_consequence_schedule: Option<String>,

    pub residual_risk_consequence_cost: Option<String>,

    pub residual_risk_consequence_schedule: Option<String>,

    pub residual_risk_consequence_scope: Option<String>,

    pub comment: Option<String>,

    pub created_at: Option<String>,

    pub risk_owner_name: Option<String>,

    pub submitted_by: Option<String>,
}