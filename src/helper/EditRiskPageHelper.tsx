import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton, Card, PageContainer, PageHeader } from "../components/ui";
import { createRiskVersion, getEditableRisk, handleOperationResult } from "../services/riskService";
import type { RiskViewState } from "../types/riskView";
import type { RiskState } from "../types/risk";
import { open } from "@tauri-apps/plugin-dialog";
import FieldHelp from "../components/FieldHelp";
import { fieldHelp } from "../config/fieldHelp";

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
};

function EditRiskPageHelper() {
  const navigate = useNavigate();
  const { issueKey } = useParams();
  const [risk, setRisk] = useState<RiskViewState>(initialRiskState);
  const [isStatusOpen, setIsStatusOpen] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRisk((prev) => ({
      ...prev,
      [name]: name === "risk_cost" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const resetRiskForm = () => { setRisk(initialRiskState); };

  const selectedStrategy = strategyOptions.find((strategy) => strategy.value === risk.risk_response_strategy);

  const loadRisk = async () => {
    if (!issueKey) {
      return;
    }

    const response = await getEditableRisk(issueKey);
    setRisk(response as RiskViewState);
  };

  const handleFileChange = async () => {
    const filePath = await open({
        multiple: false,
        filters: [
            {
                name: "Attachments",
                extensions: [
                    "pdf",
                    "jpg",
                    "jpeg",
                    "png"
                ]
            }
        ]
    });

    if (!filePath) {
        return;
    }

    setRisk(prev => ({
        ...prev,
        attached_document_path: String(filePath)
    }));
};

  useEffect(() => {
    void loadRisk();
  }, [issueKey]);

  const createRisk = async () => {
  try {
    const request: RiskState = {
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

      // Required by RiskState
      scheduled_date: "",
      actual_days: null,
      taken_days: null,
      schedule_percentage: null,

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
      resetRiskForm();
      navigate("/");
    }
  } catch (error) {
    console.error(error);
  }
};
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Edit risk"
        description="Refine the existing risk details and keep the response plan aligned with the latest context."
        eyebrow="Risk update"
        actions={<ActionButton variant="secondary" onClick={() => navigate("/")}>Back to overview</ActionButton>}
      />

      <Card title="Risk assignment" description="Update the core details and response planning for this risk.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Issue key</span>
            <input className="input" value={risk.version_key ?? risk.issue_key} disabled />
          </label>
          <label className="field-group">
            <span className="field-label">Summary</span>
            <textarea className="textarea" name="summary" placeholder="Summary" value={risk.summary} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label">Status <FieldHelp field="status" isOpen={isStatusOpen} setIsOpen={setIsStatusOpen} /></span>
            <select className="select" name="status" value={risk.status} onChange={handleChange} onMouseEnter={() => setIsStatusOpen(true)} onMouseLeave={() => setIsStatusOpen(false)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status || "Select status"}</option>
              ))}
            </select>
            <div className="selected-help">
  <div className="selected-help__title">{risk.status}</div>
  <div className="selected-help__text">
    {fieldHelp.status.options.find(option => option.value === risk.status)?.description}
  </div>
</div>
          </label>
          <label className="field-group">
            <span className="field-label">Risk group</span>
            <select className="select" name="risk_group" value={risk.risk_group} onChange={handleChange}>
              {groupOptions.map((group) => (
                <option key={group} value={group}>{group || "Select group"}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">WBS element</span>
            <input className="input" name="wbs_element" placeholder="WBS Element" value={risk.wbs_element} onChange={handleChange} />
          </label>
          <div className="field-group">
    <span className="field-label">
        Attachment
    </span>

    <button
        type="button"
        onClick={handleFileChange}
    >
        Select Attachment
    </button>

    {risk.attached_document_path && (
        <small>
            {risk.attached_document_path}
        </small>
    )}
</div>
          <div className="field-group">
            <span className="field-label">Description</span>
            <p className="field-help">Capture the risk in a clear IF / THEN style statement.</p>
            <textarea className="textarea" name="description" placeholder="Enter description" value={risk.description} onChange={handleChange} />
          </div>
          <label className="field-group">
            <span className="field-label">Probability</span>
            <select className="select" name="risk_probability" value={risk.risk_probability} onChange={handleChange}>
              <option value="">Select probability</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Consequence</span>
            <select className="select" name="risk_consequence" value={risk.risk_consequence} onChange={handleChange}>
              <option value="">Select consequence</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Greatest consequence</span>
            <select className="select" name="greatest_risk_consequence" value={risk.greatest_risk_consequence} onChange={handleChange}>
              <option value="">Select type</option>
              {greatestConsequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Risk justification</span>
            <textarea className="textarea" name="risk_justification" placeholder="Risk justification" value={risk.risk_justification} onChange={handleChange} />
          </label>
          <div className="field-group">
            <span className="field-label">Response strategy <FieldHelp field="riskResponseStrategy" isOpen={isStrategyOpen} setIsOpen={setIsStrategyOpen} /></span>
            <select className="select" name="risk_response_strategy" value={risk.risk_response_strategy} onChange={handleChange} onMouseEnter={() => setIsStrategyOpen(true)} onMouseLeave={() => setIsStrategyOpen(false)}>
              <option value="">Select strategy</option>
              {strategyOptions.map((strategy) => (
                <option key={strategy.value} value={strategy.value}>{strategy.value}</option>
              ))}
            </select>
            {selectedStrategy ? <p className="field-help">{selectedStrategy.description}</p> : null}
          </div>
          <div className="field-group">
            <span className="field-label">Response actions</span>
            <p className="field-help">Use [Potential], [Planned], [In Progress], or [Executed].</p>
            <textarea className="textarea" name="risk_response_actions" placeholder="Enter risk response actions" value={risk.risk_response_actions} onChange={handleChange} />
          </div>
          <label className="field-group">
            <span className="field-label">Residual probability</span>
            <select className="select" name="residual_risk_probability" value={risk.residual_risk_probability} onChange={handleChange}>
              <option value="">Select residual probability</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual consequence</span>
            <select className="select" name="residual_risk_consequence" value={risk.residual_risk_consequence} onChange={handleChange}>
              <option value="">Select residual consequence</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual justification</span>
            <textarea className="textarea" name="residual_risk_justification" placeholder="Residual risk justification" value={risk.residual_risk_justification} onChange={handleChange} />
          </label>
        </div>
      </Card>

      <Card title="Risk details" description="Adjust scope, cost, timing, and downstream exposure.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Risk scope</span>
            <input className="input" value={risk.risk_scope || ""} disabled />
          </label>
          <label className="field-group">
            <span className="field-label">Consequence scope</span>
            <select className="select" name="risk_consequence_scope" value={risk.risk_consequence_scope} onChange={handleChange}>
              <option value="">Select consequence scope</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Risk cost</span>
            <input className="input" type="number" name="risk_cost" placeholder="Risk Cost (INR)" value={risk.risk_cost ?? ""} onChange={handleChange} />
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
            <span className="field-label">Schedule end</span>
            <input className="input" type="date" name="risk_schedule_end" value={risk.risk_schedule_end} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label">Consequence schedule</span>
            <input className="input" value={risk.risk_consequence_schedule || ""} disabled />
          </label>
        </div>
      </Card>

      <Card title="Residual risk details" description="Track the post-mitigation view for cost, schedule, and scope.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Residual cost</span>
            <select className="select" name="residual_risk_consequence_cost" value={risk.residual_risk_consequence_cost} onChange={handleChange}>
              <option value="">Select residual cost</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual schedule</span>
            <select className="select" name="residual_risk_consequence_schedule" value={risk.residual_risk_consequence_schedule} onChange={handleChange}>
              <option value="">Select residual schedule</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual scope</span>
            <select className="select" name="residual_risk_consequence_scope" value={risk.residual_risk_consequence_scope} onChange={handleChange}>
              <option value="">Select residual scope</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card title="Additional context" description="Ownership and notes for follow-up.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Comment</span>
            <textarea className="textarea" name="comment" placeholder="Comment" value={risk.comment} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label">Created at</span>
            <input className="input" value={risk.created_at || ""} disabled />
          </label>
          <label className="field-group">
            <span className="field-label">Submitted by</span>
            <input className="input" name="submitted_by" placeholder="Submitted By" value={risk.submitted_by} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label">Risk owner</span>
            <input className="input" name="risk_owner_name" placeholder="Risk Owner" value={risk.risk_owner_name} onChange={handleChange} />
          </label>
        </div>
      </Card>

      <div className="u-flex u-gap-3 u-wrap">
        <ActionButton variant="primary" onClick={createRisk}>Create risk version</ActionButton>
        <ActionButton variant="secondary" onClick={loadRisk}>Reset</ActionButton>
      </div>
    </PageContainer>
  );
}

export default EditRiskPageHelper;
