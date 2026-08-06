import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { RiskViewState } from "../types/riskView";
import type { RiskState } from "../types/risk";
import { showMessage } from "../utils/alertUtils";
import { ActionButton, Card, PageContainer, PageHeader } from "../components/ui";
import FieldHelp from "./FieldHelp";
import { fieldHelp } from "../config/fieldHelp";
import {
  getCostConsequence,
  getSchedulePercentage,
  getScheduleConsequence,
  getRiskScope,
  getGreatestConsequence,
} from "../utils/riskRules";
import { createRiskVersion, getEditableRisk, handleOperationResult } from "../services/riskService";

const probabilityOptions = ["Almost None", "Low", "Medium", "High", "Very High"];
const consequenceOptions = ["Trivial", "Low", "Medium", "High", "Severe"];
const statusOptions = ["", "New", "Active", "Retired"];
const groupOptions = ["", "Group A", "Group B"];
const greatestConsequenceOptions = ["Scope", "Cost", "Schedule"];
const strategyOptions = [
  { value: "Avoid", description: "Change the project to eliminate the threat from the identified risk." },
  { value: "Mitigate", description: "Take early action to reduce the likelihood and/or impact of the risk." },
  { value: "Transfer", description: "Shift ownership and control of the risk to another party." },
  { value: "Accept", description: "Acknowledge the threat and accept the consequences as part of the workflow." },
];

const initialRiskState: RiskViewState = {
  issue_key: "",
  summary: "",
  status: "",
  risk_group: "",
  wbs_element: "",
  attached_document_path: "",
  description: "",
  risk_probability: "",
  risk_consequence: "",
  greatest_risk_consequence: "",
  risk_justification: "",
  risk_response_strategy: "",
  risk_response_actions: "",
  residual_risk_probability: "",
  residual_risk_consequence: "",
  residual_risk_justification: "",
  risk_scope: "",
  risk_consequence_scope: "",
  risk_cost: null,
  risk_consequence_cost: "",
  risk_schedule_start: "",
  risk_schedule_end: "",
  risk_consequence_schedule: "",
  residual_risk_consequence_cost: "",
  residual_risk_consequence_schedule: "",
  residual_risk_consequence_scope: "",
  comment: "",
  risk_owner_name: "",
  submitted_by: "",
  created_at: "",
  scheduled_date: "",
  actual_days: null,
  taken_days: null,
  schedule_percentage: null,
};

type RiskFormProps = {
  mode: "create" | "edit";
};

export default function RiskForm({ mode }: RiskFormProps) {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const [risk, setRisk] = useState<RiskViewState>(initialRiskState);

  // States for field tooltips / help
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isRiskCostOpen, setIsRiskCostOpen] = useState(false);
  const [isScheduleConsequenceOpen, setIsScheduleConsequenceOpen] = useState(false);
  const [isRiskScopeOpen, setIsRiskScopeOpen] = useState(false);

  const selectedStrategy = strategyOptions.find((strategy) => strategy.value === risk.risk_response_strategy);

  const loadRisk = async () => {
    if (mode !== "edit" || !issueKey) {
      return;
    }
    try {
      const response = await getEditableRisk(issueKey);
      setRisk(response as RiskViewState);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (mode === "edit") {
      void loadRisk();
    } else {
      setRisk(initialRiskState);
    }
  }, [mode, issueKey]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedRisk = {
      ...risk,
      [name]: value,
    };

    if (name === "risk_cost") {
      updatedRisk.risk_cost = value === "" ? null : Number(value);
      updatedRisk.risk_consequence_cost =
        updatedRisk.risk_cost === null ? "" : getCostConsequence(updatedRisk.risk_cost);
    }

    if (
      updatedRisk.risk_schedule_start &&
      updatedRisk.scheduled_date &&
      new Date(updatedRisk.scheduled_date) < new Date(updatedRisk.risk_schedule_start)
    ) {
      showMessage(
        "error",
        "Invalid Date",
        "Scheduled Date cannot be earlier than Schedule Start."
      );
      updatedRisk.actual_days = null;
      updatedRisk.taken_days = null;
      updatedRisk.schedule_percentage = null;
      return setRisk(updatedRisk);
    }

    if (
      name === "risk_schedule_start" ||
      name === "scheduled_date" ||
      name === "risk_schedule_end"
    ) {
      const { takenDays, actualDays, percentage } = getSchedulePercentage(
        updatedRisk.risk_schedule_start,
        updatedRisk.scheduled_date,
        updatedRisk.risk_schedule_end
      );

      updatedRisk.taken_days = takenDays;
      updatedRisk.actual_days = actualDays;
      updatedRisk.schedule_percentage = percentage;
      updatedRisk.risk_consequence_schedule =
        percentage === null ? "" : getScheduleConsequence(percentage);
    }

    updatedRisk.risk_scope = getRiskScope(
      updatedRisk.risk_consequence_cost,
      updatedRisk.risk_consequence_schedule
    );

    updatedRisk.greatest_risk_consequence = getGreatestConsequence(
      updatedRisk.risk_consequence_scope,
      updatedRisk.risk_consequence_cost,
      updatedRisk.risk_consequence_schedule
    );

    setRisk(updatedRisk);
  };

  const handleFileChange = async () => {
    const filePath = await open({
      multiple: false,
      filters: [{ name: "Attachments", extensions: ["pdf", "jpg", "jpeg", "png"] }],
    });

    if (!filePath) {
      return;
    }

    setRisk((prev) => ({
      ...prev,
      attached_document_path: String(filePath),
    }));
  };

  const handleReset = () => {
    if (mode === "create") {
      setRisk(initialRiskState);
    } else {
      void loadRisk();
    }
  };

  const handleSubmit = async () => {
    if (mode === "create") {
      try {
        const response = await invoke("create_risk", { risk });
        await showMessage("success", "Risk Created", String(response));
        setRisk(initialRiskState);
      } catch (error) {
        await showMessage("error", "Risk Creation Failed", String(error));
      }
    } else {
      try {
        const request: RiskState = {
          issue_key: risk.version_key ?? risk.issue_key,
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
          scheduled_date: risk.scheduled_date,
          actual_days: risk.actual_days,
          taken_days: risk.taken_days,
          schedule_percentage: risk.schedule_percentage,
          risk_consequence_schedule: risk.risk_consequence_schedule,
          residual_risk_consequence_cost: risk.residual_risk_consequence_cost,
          residual_risk_consequence_schedule: risk.residual_risk_consequence_schedule,
          residual_risk_consequence_scope: risk.residual_risk_consequence_scope,
          comment: risk.comment,
          risk_owner_name: risk.risk_owner_name,
          submitted_by: risk.submitted_by,
        };

        const success = await handleOperationResult(
          () => createRiskVersion(request),
          "Risk version created successfully",
          "Failed to create risk version"
        );

        if (success) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={mode === "create" ? "Create a risk" : "Edit risk"}
        description={
          mode === "create"
            ? "Capture the essential details of the risk and keep its response plan aligned with the workflow."
            : "Refine the existing risk details and keep the response plan aligned with the latest context."
        }
        eyebrow={mode === "edit" ? "Risk update" : undefined}
        actions={
          <ActionButton variant="secondary" onClick={() => navigate("/")}>
            Back to overview
          </ActionButton>
        }
      />

      <Card
        title="Risk assignment"
        description={
          mode === "create"
            ? "Core details and response planning for the new incident."
            : "Update the core details and response planning for this risk."
        }
      >
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Issue key</span>
            <input
              className="input"
              value={mode === "create" ? "[AUTO GENERATED ISSUE KEY]" : (risk.version_key ?? risk.issue_key)}
              disabled
            />
          </label>

          <label className="field-group">
            <span className="field-label">Summary</span>
            <textarea
              className="textarea"
              name="summary"
              placeholder="Summary"
              value={risk.summary}
              onChange={handleChange}
            />
          </label>

          <label className="field-group">
            <span className="field-label">
              Status <FieldHelp field="status" isOpen={isStatusOpen} setIsOpen={setIsStatusOpen} />
            </span>
            <select
              className="select"
              name="status"
              value={risk.status}
              onChange={handleChange}
              onMouseEnter={() => setIsStatusOpen(true)}
              onMouseLeave={() => setIsStatusOpen(false)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status || (mode === "create" ? "Select Status" : "Select status")}
                </option>
              ))}
            </select>
            <div
              className="selected-help"
              onMouseEnter={mode === "create" ? () => setIsStatusOpen(true) : undefined}
              onMouseLeave={mode === "create" ? () => setIsStatusOpen(false) : undefined}
            >
              <div className="selected-help__title">{risk.status}</div>
              <div className="selected-help__text">
                {fieldHelp.status.options.find((option) => option.value === risk.status)?.description}
              </div>
            </div>
          </label>

          <label className="field-group">
            <span className="field-label">Risk group</span>
            <select className="select" name="risk_group" value={risk.risk_group} onChange={handleChange}>
              {groupOptions.map((group) => (
                <option key={group} value={group}>
                  {group || (mode === "create" ? "Select Group" : "Select group")}
                </option>
              ))}
            </select>
          </label>

          {mode === "create" ? (
            <label className="field-group">
              <span className="field-label">WBS element</span>
              <div className="u-flex u-gap-3">
                <input
                  className="input"
                  name="wbs_element"
                  placeholder="WBS Element"
                  value={risk.wbs_element}
                  onChange={handleChange}
                />
                <ActionButton variant="secondary" onClick={handleFileChange}>
                  Attachment
                </ActionButton>
              </div>
            </label>
          ) : (
            <>
              <label className="field-group">
                <span className="field-label">WBS element</span>
                <input
                  className="input"
                  name="wbs_element"
                  placeholder="WBS Element"
                  value={risk.wbs_element}
                  onChange={handleChange}
                />
              </label>
              <div className="field-group">
                <span className="field-label">Attachment</span>
                <button type="button" onClick={handleFileChange}>
                  Select Attachment
                </button>
                {risk.attached_document_path && <small>{risk.attached_document_path}</small>}
              </div>
            </>
          )}

          <div className="field-group">
            <span className="field-label">Description</span>
            <p className="field-help">
              {mode === "create"
                ? "Write the risk in an IF / THEN statement format."
                : "Capture the risk in a clear IF / THEN style statement."}
            </p>
            <textarea
              className="textarea"
              name="description"
              placeholder={mode === "create" ? "Enter Description" : "Enter description"}
              value={risk.description}
              onChange={handleChange}
            />
          </div>

          <label className="field-group">
            <span className="field-label">Probability</span>
            <select className="select" name="risk_probability" value={risk.risk_probability} onChange={handleChange}>
              <option value="">{mode === "create" ? "Select Probability" : "Select probability"}</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Consequence</span>
            <select className="select" name="risk_consequence" value={risk.risk_consequence} onChange={handleChange}>
              <option value="">{mode === "create" ? "Select Consequence" : "Select consequence"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Greatest consequence</span>
            <select
              className="select"
              name="greatest_risk_consequence"
              value={risk.greatest_risk_consequence}
              onChange={handleChange}
              disabled={mode === "create"}
            >
              <option value="">{mode === "create" ? "Select Type" : "Select type"}</option>
              {greatestConsequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {mode === "edit" && (
            <label className="field-group">
              <span className="field-label">Risk justification</span>
              <textarea
                className="textarea"
                name="risk_justification"
                placeholder="Risk justification"
                value={risk.risk_justification}
                onChange={handleChange}
              />
            </label>
          )}

          <div className="field-group">
            <span className="field-label">
              Response strategy <FieldHelp field="riskResponseStrategy" isOpen={isStrategyOpen} setIsOpen={setIsStrategyOpen} />
            </span>
            <select
              className="select"
              name="risk_response_strategy"
              value={risk.risk_response_strategy}
              onChange={handleChange}
              onMouseEnter={mode === "edit" ? () => setIsStrategyOpen(true) : undefined}
              onMouseLeave={mode === "edit" ? () => setIsStrategyOpen(false) : undefined}
            >
              <option value="">{mode === "create" ? "Select Strategy" : "Select strategy"}</option>
              {strategyOptions.map((strategy) => (
                <option key={strategy.value} value={strategy.value}>
                  {strategy.value}
                </option>
              ))}
            </select>
            {selectedStrategy ? <p className="field-help">{selectedStrategy.description}</p> : null}
          </div>

          <div className="field-group">
            <span className="field-label">Response actions</span>
            <p className="field-help">Use [Potential], [Planned], [In Progress], or [Executed].</p>
            <textarea
              className="textarea"
              name="risk_response_actions"
              placeholder={mode === "create" ? "Enter Risk Response Actions" : "Enter risk response actions"}
              value={risk.risk_response_actions}
              onChange={handleChange}
            />
          </div>

          <label className="field-group">
            <span className="field-label">Residual probability</span>
            <select
              className="select"
              name="residual_risk_probability"
              value={risk.residual_risk_probability}
              onChange={handleChange}
            >
              <option value="">{mode === "create" ? "Select Residual Probability" : "Select residual probability"}</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Residual consequence</span>
            <select
              className="select"
              name="residual_risk_consequence"
              value={risk.residual_risk_consequence}
              onChange={handleChange}
            >
              <option value="">{mode === "create" ? "Select Residual Consequence" : "Select residual consequence"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Residual justification</span>
            <textarea
              className="textarea"
              name="residual_risk_justification"
              placeholder={mode === "create" ? "Residual Risk Justification" : "Residual risk justification"}
              value={risk.residual_risk_justification}
              onChange={handleChange}
            />
          </label>
        </div>
      </Card>

      <Card
        title="Risk details"
        description={
          mode === "create"
            ? "Supplementary context for scope, cost, timing, and residual conditions."
            : "Adjust scope, cost, timing, and downstream exposure."
        }
      >
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">
              Risk scope{" "}
              {mode === "create" ? (
                <FieldHelp field="riskScope" isOpen={isRiskScopeOpen} setIsOpen={setIsRiskScopeOpen} />
              ) : null}
            </span>
            <input className="input" value={risk.risk_scope || ""} disabled />
          </label>

          <label className="field-group">
            <span className="field-label">Consequence scope {mode === "create" ? "*" : ""}</span>
            <select
              className="select"
              name="risk_consequence_scope"
              value={risk.risk_consequence_scope}
              onChange={handleChange}
              required={mode === "create"}
            >
              <option value="">{mode === "create" ? "Select Consequence Scope" : "Select consequence scope"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">
              Risk Cost (USD){" "}
              {mode === "create" ? (
                <FieldHelp field="riskCost" isOpen={isRiskCostOpen} setIsOpen={setIsRiskCostOpen} />
              ) : null}
            </span>
            <input
              className="input"
              type="number"
              name="risk_cost"
              placeholder={mode === "create" ? "Risk Cost (USD)" : "Risk Cost (INR)"}
              value={risk.risk_cost ?? ""}
              onChange={handleChange}
            />
          </label>

          <label className="field-group">
            <span className="field-label">Consequence cost</span>
            <input className="input" value={risk.risk_consequence_cost || ""} disabled />
          </label>

          <label className="field-group">
            <span className="field-label">Schedule start</span>
            <input className="input" type="date" name="risk_schedule_start" value={risk.risk_schedule_start} onChange={handleChange} />
          </label>

          <label className="field-group">
            <span className="field-label">Scheduled Date</span>
            <input className="input" type="date" name="scheduled_date" value={risk.scheduled_date} onChange={handleChange} />
          </label>

          <label className="field-group">
            <span className="field-label">Schedule end</span>
            <input className="input" type="date" name="risk_schedule_end" value={risk.risk_schedule_end} onChange={handleChange} />
          </label>

          <label className="field-group">
            <span className="field-label">Schedule Percentage</span>
            <input className="input" value={risk.schedule_percentage ?? ""} disabled />
          </label>

          <label className="field-group">
            <span className="field-label">
              Consequence Schedule{" "}
              {mode === "create" ? (
                <FieldHelp field="schedulePercentage" isOpen={isScheduleConsequenceOpen} setIsOpen={setIsScheduleConsequenceOpen} />
              ) : null}
            </span>
            <input className="input" value={risk.risk_consequence_schedule || ""} disabled />
          </label>
        </div>
      </Card>

      <Card
        title="Residual risk details"
        description={
          mode === "create"
            ? "Track downstream exposure after mitigation planning."
            : "Track the post-mitigation view for cost, schedule, and scope."
        }
      >
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Residual cost</span>
            <select
              className="select"
              name="residual_risk_consequence_cost"
              value={risk.residual_risk_consequence_cost}
              onChange={handleChange}
            >
              <option value="">{mode === "create" ? "Select Residual Cost" : "Select residual cost"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Residual schedule</span>
            <select
              className="select"
              name="residual_risk_consequence_schedule"
              value={risk.residual_risk_consequence_schedule}
              onChange={handleChange}
            >
              <option value="">{mode === "create" ? "Select Residual Schedule" : "Select residual schedule"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span className="field-label">Residual scope</span>
            <select
              className="select"
              name="residual_risk_consequence_scope"
              value={risk.residual_risk_consequence_scope}
              onChange={handleChange}
            >
              <option value="">{mode === "create" ? "Select Residual Scope" : "Select residual scope"}</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {mode === "create" && (
            <label className="field-group">
              <span className="field-label">Risk justification</span>
              <textarea
                className="textarea"
                name="risk_justification"
                placeholder="Risk Justification"
                value={risk.risk_justification}
                onChange={handleChange}
              />
            </label>
          )}
        </div>
      </Card>

      <Card title="Additional context" description="Ownership and notes for follow-up.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Comment</span>
            <textarea
              className="textarea"
              name="comment"
              placeholder="Comment"
              value={risk.comment}
              onChange={handleChange}
            />
          </label>

          {mode === "edit" && (
            <label className="field-group">
              <span className="field-label">Created at</span>
              <input className="input" value={risk.created_at || ""} disabled />
            </label>
          )}

          <label className="field-group">
            <span className="field-label">Submitted by</span>
            <input
              className="input"
              name="submitted_by"
              placeholder="Submitted By"
              value={risk.submitted_by}
              onChange={handleChange}
            />
          </label>

          <label className="field-group">
            <span className="field-label">Risk owner</span>
            <input
              className="input"
              name="risk_owner_name"
              placeholder="Risk Owner"
              value={risk.risk_owner_name}
              onChange={handleChange}
            />
          </label>
        </div>
      </Card>

      <div className="u-flex u-gap-3 u-wrap">
        <ActionButton variant="primary" onClick={handleSubmit}>
          {mode === "create" ? "Create risk" : "Create risk version"}
        </ActionButton>
        <ActionButton variant="secondary" onClick={handleReset}>
          Reset
        </ActionButton>
      </div>
    </PageContainer>
  );
}
