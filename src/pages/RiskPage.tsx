import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { RiskState } from "../types/risk";
import { showMessage } from "../utils/alertUtils";
import { ActionButton, Card, PageContainer, PageHeader } from "../components/ui";
import FieldHelp from "../components/FieldHelp";
import { fieldHelp } from "../config/fieldHelp";
import { getCostConsequence, getSchedulePercentage, getScheduleConsequence,getRiskScope,getGreatestConsequence, } from "../utils/riskRules";

const probabilityOptions = ["Almost None", "Low", "Medium", "High", "Very High"];
const consequenceOptions = ["Trivial", "Low", "Medium", "High", "Severe"];
const statusOptions = ["", "New", "Active", "Retired"];
const groupOptions = ["", "Group A", "Group B"];
const greatestConsequenceOptions = ["Scope", "Cost", "Schedule"];
const strategyOptions = [
  { value: "Avoid", description: "Change the project to remove the threat from the identified risk." },
  { value: "Mitigate", description: "Take early action to reduce the likelihood and/or impact of the risk." },
  { value: "Transfer", description: "Shift ownership and responsibility of the risk to another party." },
  { value: "Accept", description: "Acknowledge the threat and accept the consequences as part of the project." },
];

const initialRiskState: RiskState = {
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
  scheduled_date: "",

actual_days: null,
taken_days: null,
schedule_percentage: null,
  risk_consequence_schedule: "",
  residual_risk_consequence_cost: "",
  residual_risk_consequence_schedule: "",
  residual_risk_consequence_scope: "",
  comment: "",
  risk_owner_name: "",
  submitted_by: "",
};

function RiskPage() {
  const navigate = useNavigate();
  const [risk, setRisk] = useState<RiskState>(initialRiskState);
  const resetForm = () => setRisk(initialRiskState);
  const selectedStrategy = strategyOptions.find((strategy) => strategy.value === risk.risk_response_strategy);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//   const { name, value } = e.target;

//   if (name === "risk_cost") {
//     const cost = value === "" ? null : Number(value);
//     return setRisk({ ...risk, risk_cost: cost, risk_consequence_cost: cost === null ? "" : getCostConsequence(cost) });
//   }

//   setRisk({ ...risk, [name]: value });
// };

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  const updatedRisk = { ...risk, [name]: value };

  if (name === "risk_cost") {
  updatedRisk.risk_cost = value === "" ? null : Number(value);
  updatedRisk.risk_consequence_cost =
    updatedRisk.risk_cost === null
      ? ""
      : getCostConsequence(updatedRisk.risk_cost);
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

  updatedRisk.taken_days = null;
  updatedRisk.actual_days = null;
  updatedRisk.schedule_percentage = null;

  return setRisk(updatedRisk);
}

// if (name === "risk_consequence_scope") {
//   updatedRisk.greatest_risk_consequence = getGreatestConsequence(
//     value,
//     updatedRisk.risk_consequence_cost,
//     updatedRisk.risk_consequence_schedule
//   );
// }

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
    updatedRisk.risk_consequence_schedule = percentage === null ? "" : getScheduleConsequence(percentage);
   
  }

updatedRisk.risk_scope = getRiskScope(updatedRisk.risk_consequence_cost,updatedRisk.risk_consequence_schedule);

updatedRisk.greatest_risk_consequence = getGreatestConsequence(updatedRisk.risk_consequence_scope,updatedRisk.risk_consequence_cost,updatedRisk.risk_consequence_schedule);

  setRisk(updatedRisk);
};

  const createRisk = async () => {
    try {
      const response = await invoke("create_risk", { risk });
      await showMessage("success", "Risk Created", String(response));
      setRisk(initialRiskState);
    } catch (error) {
      await showMessage("error", "Risk Creation Failed", String(error));
    }
  };

  const handleFileChange = async () => {
    const filePath = await open({
      multiple: false,
      filters: [{ name: "Attachments", extensions: ["pdf", "jpg", "jpeg", "png"] }],
    });

    if (!filePath) {
      return;
    }

    setRisk({ ...risk, attached_document_path: String(filePath) });
  };

  

  const [isOpen, setIsOpen] = useState(false);
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isRiskCostOpen, setIsRiskCostOpen] = useState(false);
 const [isScheduleConsequenceOpen, setIsScheduleConsequenceOpen] = useState(false);
 const [isRiskScopeOpen, setIsRiskScopeOpen] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Create a risk"
        description="Capture the essential details of the risk and keep its response plan aligned with the workflow."
        actions={<ActionButton variant="secondary" onClick={() => navigate("/")}>Back to overview</ActionButton>}
      />

      <Card title="Risk assignment" description="Core details and response planning for the new incident.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Issue key</span>
            <input className="input" value="[AUTO GENERATED ISSUE KEY]" disabled />
          </label>
          <label className="field-group">
            <span className="field-label">Summary</span>
            <textarea className="textarea" name="summary" placeholder="Summary" value={risk.summary} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label"> Status <FieldHelp field="status" isOpen={isOpen} setIsOpen={setIsOpen} /></span>
            <select className="select" name="status" value={risk.status} onChange={handleChange} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status || "Select Status"}</option>
              ))}
            </select>
          <div className="selected-help"
            onMouseEnter={() => setIsOpen(true)}
  onMouseLeave={() => setIsOpen(false)}>
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
                <option key={group} value={group}>{group || "Select Group"}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">WBS element</span>
            <div className="u-flex u-gap-3">
              <input className="input" name="wbs_element" placeholder="WBS Element" value={risk.wbs_element} onChange={handleChange} />
              <ActionButton variant="secondary" onClick={handleFileChange}>Attachment</ActionButton>
            </div>
          </label>
          <div className="field-group">
            <span className="field-label">Description</span>
            <p className="field-help">Write the risk in an IF / THEN statement format.</p>
            <textarea className="textarea" name="description" placeholder="Enter Description" value={risk.description} onChange={handleChange} />
          </div>
          <label className="field-group">
            <span className="field-label">Probability</span>
            <select className="select" name="risk_probability" value={risk.risk_probability} onChange={handleChange}>
              <option value="">Select Probability</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Consequence</span>
            <select className="select" name="risk_consequence" value={risk.risk_consequence} onChange={handleChange}>
              <option value="">Select Consequence</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Greatest consequence</span>
            <select className="select" name="greatest_risk_consequence" value={risk.greatest_risk_consequence} onChange={handleChange} disabled>
              <option value="">Select Type</option>
              {greatestConsequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        
          <div className="field-group">
            <span className="field-label">Response strategy <FieldHelp field="riskResponseStrategy" isOpen={isStrategyOpen} setIsOpen={setIsStrategyOpen} /></span>
            <select className="select" name="risk_response_strategy" value={risk.risk_response_strategy} onChange={handleChange}>
              <option value="">Select Strategy</option>
              {strategyOptions.map((strategy) => (
                <option key={strategy.value} value={strategy.value}>{strategy.value}</option>
              ))}
            </select>
            {selectedStrategy ? <p className="field-help">{selectedStrategy.description}</p> : null}
          </div>
          <div className="field-group">
            <span className="field-label">Response actions</span>
            <p className="field-help">Use [Potential], [Planned], [In Progress], or [Executed].</p>
            <textarea className="textarea" name="risk_response_actions" placeholder="Enter Risk Response Actions" value={risk.risk_response_actions} onChange={handleChange} />
          </div>
          <label className="field-group">
            <span className="field-label">Residual probability</span>
            <select className="select" name="residual_risk_probability" value={risk.residual_risk_probability} onChange={handleChange}>
              <option value="">Select Residual Probability</option>
              {probabilityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual consequence</span>
            <select className="select" name="residual_risk_consequence" value={risk.residual_risk_consequence} onChange={handleChange}>
              <option value="">Select Residual Consequence</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual justification</span>
            <textarea className="textarea" name="residual_risk_justification" placeholder="Residual Risk Justification" value={risk.residual_risk_justification} onChange={handleChange} />
          </label>
        </div>
      </Card>

      <Card title="Risk details" description="Supplementary context for scope, cost, timing, and residual conditions.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Risk scope <FieldHelp field="riskScope" isOpen={isRiskScopeOpen} setIsOpen={setIsRiskScopeOpen} /></span>
            <input className="input" value={risk.risk_scope} disabled />
          </label>
          <label className="field-group">
            <span className="field-label">Consequence scope *</span>
            <select className="select" name="risk_consequence_scope" value={risk.risk_consequence_scope} onChange={handleChange} required>
              <option value="">Select Consequence Scope</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Risk Cost (USD) <FieldHelp field="riskCost" isOpen={isRiskCostOpen} setIsOpen={setIsRiskCostOpen} /></span>
            <input className="input" type="number" name="risk_cost" placeholder="Risk Cost (USD)" value={risk.risk_cost ?? ""} onChange={handleChange} />
          </label>
          <label className="field-group">
            <span className="field-label">Consequence cost</span>
            <input className="input" value={risk.risk_consequence_cost} disabled />
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
  <input
    className="input"
    value={risk.schedule_percentage ?? ""}
    disabled
  />
</label>
          <label className="field-group">
            <span className="field-label">Consequence Schedule <FieldHelp field="schedulePercentage" isOpen={isScheduleConsequenceOpen} setIsOpen={setIsScheduleConsequenceOpen} /></span>
            <input className="input" value={risk.risk_consequence_schedule} disabled />
          </label>
        </div>
      </Card>

      <Card title="Residual risk details" description="Track downstream exposure after mitigation planning.">
        <div className="form-grid form-grid--wide">
          <label className="field-group">
            <span className="field-label">Residual cost</span>
            <select className="select" name="residual_risk_consequence_cost" value={risk.residual_risk_consequence_cost} onChange={handleChange}>
              <option value="">Select Residual Cost</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual schedule</span>
            <select className="select" name="residual_risk_consequence_schedule" value={risk.residual_risk_consequence_schedule} onChange={handleChange}>
              <option value="">Select Residual Schedule</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span className="field-label">Residual scope</span>
            <select className="select" name="residual_risk_consequence_scope" value={risk.residual_risk_consequence_scope} onChange={handleChange}>
              <option value="">Select Residual Scope</option>
              {consequenceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
            <label className="field-group">
            <span className="field-label">Risk justification</span>
            <textarea className="textarea" name="risk_justification" placeholder="Risk Justification" value={risk.risk_justification} onChange={handleChange} />
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
        <ActionButton variant="primary" onClick={createRisk}>Create risk</ActionButton>
        <ActionButton variant="secondary" onClick={resetForm}>Reset</ActionButton>
      </div>
    </PageContainer>
  );
}

export default RiskPage;
