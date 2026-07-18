import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRiskByKey, getRiskVersions, openDocument } from "../services/riskService";
import type { RiskViewState } from "../types/riskView";
import type { RiskVersionState } from "../types/riskVersion";
import { Card, DataTable, EmptyState, PageContainer, PageHeader, StatusBadge } from "../components/ui";

function ViewPageHelper() {
  const { issueKey } = useParams();
  const navigate = useNavigate();
  const [risk, setRisk] = useState<RiskViewState | null>(null);
  const [versions, setVersions] = useState<RiskVersionState[]>([]);

  const loadRisk = useCallback(async () => {
    const response = await getRiskByKey(issueKey as string);
    setRisk(response as RiskViewState);
  }, [issueKey]);

  const loadVersions = useCallback(async () => {
    const response = await getRiskVersions(issueKey as string);
    setVersions(response as RiskVersionState[]);
  }, [issueKey]);

  useEffect(() => {
    const fetchData = async () => {
      await loadRisk();
      await loadVersions();
    };

    void fetchData();
  }, [loadRisk, loadVersions]);

  return (
    <PageContainer>
      <PageHeader title="Risk details & history" description="Review the live risk record and all versioned changes stored for this item." />

      {risk ? (
        <div className="summary-grid">
          <div className="metric-card">
            <span className="metric-card__label">Issue key</span>
            <span className="metric-card__value">{risk.issue_key}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Status</span>
            <span className="metric-card__value"><StatusBadge label={risk.status || "-"} tone={risk.status === "Active" ? "success" : risk.status === "New" ? "info" : "neutral"} /></span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Risk group</span>
            <span className="metric-card__value">{risk.risk_group || "-"}</span>
          </div>
          <div className="metric-card">
            <span className="metric-card__label">Owner</span>
            <span className="metric-card__value">{risk.risk_owner_name || "-"}</span>
          </div>
        </div>
      ) : null}

      <Card title="Version timeline" description="The primary record appears first, followed by all available versions.">
        <DataTable headers={["Issue / version key", "Summary", "Status", "Group", "Owner", "Probability", "Consequence", "Document", "Actions"]}>
          {risk ? (
            <tr>
              <td>
                <button type="button" className="text-link" onClick={() => navigate(`/single/${risk.issue_key}`)}>{risk.issue_key}</button>
              </td>
              <td>{risk.summary || "-"}</td>
              <td><StatusBadge label={risk.status || "-"} tone={risk.status === "Active" ? "success" : risk.status === "New" ? "info" : "neutral"} /></td>
              <td>{risk.risk_group || "-"}</td>
              <td>{risk.risk_owner_name || "-"}</td>
              <td>{risk.risk_probability || "-"}</td>
              <td>{risk.risk_consequence || "-"}</td>
              <td>
                <button type="button" className="text-link" onClick={() => risk.attached_document_path && openDocument(risk.attached_document_path)}>
                  {risk.attached_document_path ? "Open document" : "No document"}
                </button>
              </td>
              <td>
                <button type="button" className="text-link" onClick={() => navigate(`/edit/${risk.issue_key}`)}>Edit</button>
              </td>
            </tr>
          ) : null}
          {versions.map((version) => (
            <tr key={version.version_key ?? ""}>
              <td>
                <button type="button" className="text-link" onClick={() => navigate(`/single/${version.version_key}`)}>{version.version_key}</button>
              </td>
              <td>{version.summary || "-"}</td>
              <td><StatusBadge label={version.status || "-"} tone={version.status === "Active" ? "success" : version.status === "New" ? "info" : "neutral"} /></td>
              <td>{version.risk_group || "-"}</td>
              <td>{version.risk_owner_name || "-"}</td>
              <td>{version.risk_probability || "-"}</td>
              <td>{version.risk_consequence || "-"}</td>
              <td>
                <button type="button" className="text-link" onClick={() => version.attached_document_path && openDocument(version.attached_document_path)}>
                  {version.attached_document_path ? "Open document" : "No document"}
                </button>
              </td>
              <td>
                <button type="button" className="text-link" onClick={() => navigate(`/single/${version.version_key}`)}>Inspect</button>
              </td>
            </tr>
          ))}
        </DataTable>
      </Card>

      {versions.length === 0 && !risk ? (
        <EmptyState title="No versions available" description="There is no versioned history for this risk yet." />
      ) : null}
    </PageContainer>
  );
}

export default ViewPageHelper;