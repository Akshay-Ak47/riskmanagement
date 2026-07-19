import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Swal from "sweetalert2";
//import { openDocument } from "../services/riskService";
import type { RiskViewState } from "../types/riskView";
import { ActionButton, Card, DataTable, EmptyState, PageContainer, PageHeader, StatusBadge } from "../components/ui";

function HelperHome1() {
  const [risks, setRisks] = useState<RiskViewState[]>([]);
  const navigate = useNavigate();

  const loadRisks = async () => {
    try {
      const response = await invoke("get_risks");
      setRisks(response as RiskViewState[]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRisk = async (issueKey: string) => {
    const result = await Swal.fire({
      title: "Delete Risk",
      text: `Are you sure you want to delete risk ${issueKey}? Please enter your name to continue.`,
      input: "text",
      inputPlaceholder: "Enter your name",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      didOpen: () => {
        const input = Swal.getInput();
        if (input) {
          input.style.color = "#fff";
          input.style.backgroundColor = "#333";
          input.style.borderColor = "#666";
        }
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Name is required";
        }
        return null;
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    const deletedBy = result.value;

    try {
      await invoke("delete_risk", { issueKey, deletedBy });
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${issueKey} deleted successfully`,
        timer: 2000,
        showConfirmButton: false,
      });
      await loadRisks();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: String(error),
      });
    }
  };

  

  useEffect(() => {
    void loadRisks();
  }, []);

  const summaryStats = useMemo(() => {
    const activeCount = risks.filter((item) => item.status === "Active").length;
    const newCount = risks.filter((item) => item.status === "New").length;
    const highRiskCount = risks.filter((item) => item.risk_probability === "High" || item.risk_probability === "Very High").length;

    return [
      { label: "Total Risks", value: risks.length },
      { label: "Active", value: activeCount },
      { label: "New", value: newCount },
      { label: "High Exposure", value: highRiskCount },
    ];
  }, [risks]);

  const getStatusTone = (status: string) => {
    if (status === "Active") return "success";
    if (status === "New") return "info";
    if (status === "Retired") return "neutral";
    return "warning";
  };

  return (
    <PageContainer>
      <PageHeader
        title="Risk register"
        description="A focused view of active risks, owners, and next actions for the current program."
        actions={<ActionButton variant="primary" onClick={() => navigate("/risk")}>Create new risk</ActionButton>}
      />

      <div className="summary-grid">
        {summaryStats.map((item) => (
          <div key={item.label} className="metric-card">
            <span className="metric-card__label">{item.label}</span>
            <span className="metric-card__value">{item.value}</span>
          </div>
        ))}
      </div>

      {risks.length === 0 ? (
        <EmptyState title="No risks found" description="Create a new entry to start tracking your risk register." action={<ActionButton variant="primary" onClick={() => navigate("/risk")}>Add risk</ActionButton>} />
      ) : (
        <Card title="Current register" description="Review, edit, or remove risk items without changing the underlying workflow.">
          <DataTable headers={["Issue key", "Summary", "Status", "Group", "Owner", "Probability", "Consequence", "Actions"]}>
            {risks.map((risk) => (
              <tr key={risk.issue_key}>
                <td>
                  <button type="button" className="text-link" onClick={() => navigate(`/single/${risk.issue_key}`)}>
                    {risk.issue_key}
                  </button>
                </td>
                <td>{risk.summary || "-"}</td>
                <td>
                  <StatusBadge label={risk.status || "-"} tone={getStatusTone(risk.status)} />
                </td>
                <td>{risk.risk_group || "-"}</td>
                <td>{risk.risk_owner_name || "-"}</td>
                <td>{risk.risk_probability || "-"}</td>
                <td>{risk.risk_consequence || "-"}</td>
                <td>
                  <div className="u-flex u-gap-2 u-wrap">
                    {/* <button type="button" className="text-link" onClick={() => risk.attached_document_path && openDocument(risk.attached_document_path)}>
                      {risk.attached_document_path ? "Document" : "No doc"}
                    </button> */}
                    <ActionButton variant="secondary" onClick={() => navigate(`/edit/${risk.issue_key}`)}>Edit</ActionButton>
                    <ActionButton variant="danger" onClick={() => deleteRisk(risk.issue_key)}>Delete</ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>
      )}
    </PageContainer>
  );
}

export default HelperHome1;