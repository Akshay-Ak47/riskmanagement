export type RiskHistory = {

    record_key?: string;

    record_type?: string;

    parent_issue_key?: string;

    version_no?: number;

    summary?: string;

    status?: string;

    risk_group?: string;

    wbs_element?: string;

    attached_document_path?: string;

    description?: string;

    risk_probability?: string;

    risk_consequence?: string;

    greatest_risk_consequence?: string;

    risk_justification?: string;

    risk_response_strategy?: string;

    risk_response_actions?: string;

    residual_risk_probability?: string;

    residual_risk_consequence?: string;

    residual_risk_justification?: string;

    risk_scope?: string;

    risk_consequence_scope?: string;

    risk_cost?: number;

    risk_consequence_cost?: string;

    risk_schedule_start?: string;

    risk_schedule_end?: string;

    risk_consequence_schedule?: string;

    residual_risk_consequence_cost?: string;

    residual_risk_consequence_schedule?: string;

    residual_risk_consequence_scope?: string;

    comment?: string;

    created_at?: string;

    risk_owner_name?: string;

    submitted_by?: string;

    deleted_at?: string;

    deleted_by?: string;
};