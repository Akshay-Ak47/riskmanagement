import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRiskByKey, getRiskVersionByKey, openDocument } from "../services/riskService";
import type { RiskMerge } from "../types/riakMerg";
import { ActionButton, Card, EmptyState, PageContainer, PageHeader, StatusBadge } from "../components/ui";

function SingleRiskViewPageHelper() {
  const { issueKey } = useParams();
  const [data, setData] = useState<RiskMerge | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    if (!issueKey) {
      return;
    }

    try {
      const response = issueKey.includes(".") ? await getRiskVersionByKey(issueKey) : await getRiskByKey(issueKey);
      setData(response as RiskMerge);
    } catch (error) {
      console.error("Failed to load risk:", error);
      setData(null);
    }
  };

  useEffect(() => {
    void loadData();
  }, [issueKey]);

  const renderField = (label: string, value: unknown) => (
    <div className="surface-card surface-card--tight">
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__value" style={{ fontSize: "0.95rem" }}>
        {value !== null && value !== undefined && value !== "" ? String(value) : "-"}
      </div>
    </div>
  );

  if (!data) {
    const isVersionRequest = issueKey?.includes(".");
    return (
      <PageContainer>
        <PageHeader title={isVersionRequest ? "Risk version details" : "Risk details"} description="The selected item could not be loaded from the workspace." />
        <EmptyState title="No data found" description="The current record is unavailable. Retry or return to the overview." />
      </PageContainer>
    );
  }

  const isVersion = !!data.version_key;

  return (
    <PageContainer>
      <PageHeader title={isVersion ? "Risk version details" : "Risk details"} description="A structured view of the selected risk record and its key attributes." />
      <ActionButton
  variant="secondary"
  onClick={() => navigate(-1)}
>
  ← Back
</ActionButton>
      <Card title={isVersion ? "Version summary" : "Primary record"} description={isVersion ? "Version metadata and history context" : "Operational context for the selected risk"}>
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-card__label">Status</span>
            <span className="metric-card__value"><StatusBadge label={data.status || "-"} tone={data.status === "Active" ? "success" : data.status === "New" ? "info" : "neutral"} /></span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Group</span>
            <span className="metric-card__value">{data.risk_group || "-"}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Probability</span>
            <span className="metric-card__value">{data.risk_probability || "-"}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Consequence</span>
            <span className="metric-card__value">{data.risk_consequence || "-"}</span>
          </div>
        </div>

        <div className="form-grid form-grid--wide">
          {isVersion ? (
            <>
              {renderField("Version key", data.version_key)}
              {renderField("Parent issue key", data.parent_issue_key)}
              {renderField("Version number", data.version_no)}
            </>
          ) : (
            <div className="surface-card surface-card--tight">
              <div className="metric-card__label">Issue key</div>
              <button type="button" className="text-link" onClick={() => navigate(`/view/${data.issue_key}`)}>
                {data.issue_key}
              </button>
            </div>
          )}

          <div className="surface-card surface-card--tight">
            <div className="metric-card__label">Attached document</div>
            <button type="button" className="text-link" onClick={() => data.attached_document_path && openDocument(data.attached_document_path)}>
              {data.attached_document_path ? "Open document" : "No document"}
            </button>
          </div>

          {renderField("Summary", data.summary)}
          {renderField("Status", data.status)}
          {renderField("Risk group", data.risk_group)}
          {renderField("WBS element", data.wbs_element)}
          {renderField("Description", data.description)}
          {renderField("Risk probability", data.risk_probability)}
          {renderField("Risk consequence", data.risk_consequence)}
          {renderField("Greatest risk consequence", data.greatest_risk_consequence)}
          {renderField("Risk justification", data.risk_justification)}
          {renderField("Risk response strategy", data.risk_response_strategy)}
          {renderField("Risk response actions", data.risk_response_actions)}
          {renderField("Residual risk probability", data.residual_risk_probability)}
          {renderField("Residual risk consequence", data.residual_risk_consequence)}
          {renderField("Residual risk justification", data.residual_risk_justification)}
          {renderField("Risk scope", data.risk_scope)}
          {renderField("Risk consequence scope", data.risk_consequence_scope)}
          {renderField("Risk cost", data.risk_cost)}
          {renderField("Risk consequence cost", data.risk_consequence_cost)}
          {renderField("Risk schedule start", data.risk_schedule_start)}
          {renderField("Risk schedule end", data.risk_schedule_end)}
          {renderField("Risk consequence schedule", data.risk_consequence_schedule)}
          {renderField("Residual risk consequence cost", data.residual_risk_consequence_cost)}
          {renderField("Residual risk consequence schedule", data.residual_risk_consequence_schedule)}
          {renderField("Residual risk consequence scope", data.residual_risk_consequence_scope)}
          {renderField("Comment", data.comment)}
          {renderField("Risk owner name", data.risk_owner_name)}
          {renderField("Submitted by", data.submitted_by)}
          {renderField("Created at", data.created_at)}
        </div>
      </Card>
    </PageContainer>
  );
}

export default SingleRiskViewPageHelper;
