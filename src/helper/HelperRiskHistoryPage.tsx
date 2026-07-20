import { useEffect, useState } from "react";
import { getAllHistory } from "../services/riskService";
import type { RiskHistory } from "../types/riskHistory";
import { Card, DataTable, EmptyState, PageContainer, PageHeader } from "../components/ui";

function HelperRiskHistoryPage() {
  const [history, setHistory] = useState<RiskHistory[]>([]);

  const loadHistory = async () => {
    try {
      const response = await getAllHistory();
      setHistory(response as RiskHistory[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <PageContainer>
      <PageHeader title="Risk history" description="Audit log of all recorded changes, version snapshots, and deletions for the workspace." />

      <div className="summary-grid">
        <div className="metric-card">
          <span className="metric-card__label">Records</span>
          <span className="metric-card__value">{history.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-card__label">Latest event</span>
          <span className="metric-card__value">{history[0]?.record_type || "-"}</span>
        </div>
      </div>

      <Card title="History timeline" description="The full audit trail remains available in a compact and scroll-friendly table.">
        {history.length === 0 ? (
          <EmptyState title="No history found" description="There are no history entries to display yet." />
        ) : (
          <DataTable
  className="history-table"
  headers={[
    "Record Key",
    "Record Type",
    "Parent Key",
    "Version",
    "Summary",
    "Status",
    "Risk Group",
    "WBS Element",
    "Description",
    "Probability",
    "Consequence",
    "Greatest Consequence",
    "Justification",
    "Response Strategy",
    "Response Actions",
    "Residual Probability",
    "Residual Consequence",
    "Residual Justification",
    "Scope",
    "Consequence Scope",
    "Risk Cost",
    "Consequence Cost",
    "Schedule Start",
    "Schedule End",
    "Consequence Schedule",
    "Residual Cost",
    "Residual Schedule",
    "Residual Scope",
    "Comment",
    "Owner",
    "Submitted By",
    "Created At",
    "Deleted By",
    "Deleted At",
    "Attachment"
  ]}
>
           {history.map((item, index) => (
<tr key={`${item.record_key ?? "record"}-${index}`}>
    <td>{item.record_key ?? "-"}</td>
    <td>{item.record_type ?? "-"}</td>
    <td>{item.parent_issue_key ?? "-"}</td>
    <td>{item.version_no ?? "-"}</td>

    <td>{item.summary ?? "-"}</td>
    <td>{item.status ?? "-"}</td>
    <td>{item.risk_group ?? "-"}</td>
    <td>{item.wbs_element ?? "-"}</td>

    <td>{item.description ?? "-"}</td>
    <td>{item.risk_probability ?? "-"}</td>
    <td>{item.risk_consequence ?? "-"}</td>
    <td>{item.greatest_risk_consequence ?? "-"}</td>

    <td>{item.risk_justification ?? "-"}</td>
    <td>{item.risk_response_strategy ?? "-"}</td>
    <td>{item.risk_response_actions ?? "-"}</td>

    <td>{item.residual_risk_probability ?? "-"}</td>
    <td>{item.residual_risk_consequence ?? "-"}</td>
    <td>{item.residual_risk_justification ?? "-"}</td>

    <td>{item.risk_scope ?? "-"}</td>
    <td>{item.risk_consequence_scope ?? "-"}</td>

    <td>{item.risk_cost ?? "-"}</td>
    <td>{item.risk_consequence_cost ?? "-"}</td>

    <td>{item.risk_schedule_start ?? "-"}</td>
    <td>{item.risk_schedule_end ?? "-"}</td>
    <td>{item.risk_consequence_schedule ?? "-"}</td>

    <td>{item.residual_risk_consequence_cost ?? "-"}</td>
    <td>{item.residual_risk_consequence_schedule ?? "-"}</td>
    <td>{item.residual_risk_consequence_scope ?? "-"}</td>

    <td>{item.comment ?? "-"}</td>

    <td>{item.risk_owner_name ?? "-"}</td>
    <td>{item.submitted_by ?? "-"}</td>

    <td>{item.created_at ?? "-"}</td>

    <td>{item.deleted_by ?? "-"}</td>
    <td>{item.deleted_at ?? "-"}</td>

    <td>{item.attached_document_path ?? "-"}</td>
</tr>
))}
          </DataTable>
        )}
      </Card>
    </PageContainer>
  );
}

export default HelperRiskHistoryPage;