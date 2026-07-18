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
          <DataTable headers={["Record key", "Type", "Parent key", "Version", "Summary", "Status", "Owner", "Submitted by", "Deleted by"]}>
            {history.map((item, index) => (
              <tr key={`${item.record_key ?? "record"}-${index}`}>
                <td>{item.record_key ?? "-"}</td>
                <td>{item.record_type ?? "-"}</td>
                <td>{item.parent_issue_key ?? "-"}</td>
                <td>{item.version_no ?? "-"}</td>
                <td>{item.summary ?? "-"}</td>
                <td>{item.status ?? "-"}</td>
                <td>{item.risk_owner_name ?? "-"}</td>
                <td>{item.submitted_by ?? "-"}</td>
                <td>{item.deleted_by ?? "-"}</td>
              </tr>
            ))}
          </DataTable>
        )}
      </Card>
    </PageContainer>
  );
}

export default HelperRiskHistoryPage;