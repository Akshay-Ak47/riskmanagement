


import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";

import "./../styles/RiskPage.css";
import type { RiskViewState } from "../types/riskView";
import {getEditableRisk,createRiskVersion, handleOperationResult } from "../services/riskService";
import { useNavigate } from "react-router-dom";



const probabilityOptions = [
    "Almost None",
    "Low",
    "Medium",
    "High",
    "Very High"
];

const consequenceOptions = [
    "Trivial",
    "Low",
    "Medium",
    "High",
    "Severe"
];

const statusOptions = [
    "",
    "New",
    "Active",
    "Retired"
];

const groupOptions = [
    "",
    "Group A",
    "Group B"
];

const greatestConsequenceOptions = [
    "Scope",
    "Cost",
    "Schedule"
];

const strategyOptions = [

    {
        value: "Avoid",
        description:
            "This strategy involves changing the project to eliminate the threat from identified risk."
    },

    {
        value: "Mitigate",
        description:
            "This strategy involves taking early action to reduce the likelihood and/or impact of risk."
    },

    {
        value: "Transfer",
        description:
            "This strategy involves shifting the responsibility and ownership of the risk to another party."
    },

    {
        value: "Accept",
        description:
            "This strategy involves acknowledging the threat as part of the project and accepting the consequences."
    }
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
    created_at: ""
};

function EditRiskPageHelper() {

    const navigate =  useNavigate();


    const { issueKey } = useParams();

     const [risk, setRisk] =
            useState<RiskViewState>(
                initialRiskState
            );

      const handleChange = (
    e: ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
) => {

    const { name, value } = e.target;

    setRisk(prev => ({
        ...prev,
        [name]: value
    }));
};
       
const resetRiskForm = () => {

    setRisk({

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

        created_at: "",

        risk_owner_name: "",

        submitted_by: ""
    });
};

const selectedStrategy =
    strategyOptions.find(
        strategy =>
            strategy.value ===
            risk.risk_response_strategy
    );

    const loadRisk = async () => {

    const response =
        await getEditableRisk(
            issueKey as string
        );

    console.log(
        "Backend Response:",
        response
    );

    const riskData =
        response as RiskViewState;

    console.log(
        "Risk Data:",
        riskData
    );

    setRisk(riskData);
};

useEffect(() => {
    const fetchRisk = async () => {
        const response = await getEditableRisk(
                             issueKey as string
                         );

        console.log("Backend Response:", response);

        const riskData = response as RiskViewState;

        console.log("Risk Data:", riskData);

        setRisk(riskData);
    };

    void fetchRisk();
}, [issueKey]);


const createRisk = async () => {
   
    try {

        const request = {

            ...risk,

            issue_key:
                (risk as any).parent_issue_key ??
                risk.issue_key
        };

        console.log(
            "Sending:",
            request
        );

       const success =
    await handleOperationResult(

        () =>
            createRiskVersion(
                request
            ),

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

    return (
       <div className="risk-container">

                   <h1>Edit Risk Register</h1>

                   {/* SECTION 1 */}

                   <div className="section-card">

                       <h2>Risk Assignment</h2>

                       <div className="grid-container">

                           <input
                                 value={
                                      (risk as any).version_key ??
                                      risk.issue_key
                                  }
                               disabled
                           />

                           <textarea
                               name="summary"
                               placeholder="Summary"
                               value={risk.summary}
                               onChange={handleChange}
                           />

                           <select
                               name="status"
                               value={risk.status}
                               onChange={handleChange}
                           >

                               {statusOptions.map(status => (

                                   <option
                                       key={status}
                                       value={status}
                                   >
                                       {status || "Select Status"}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="risk_group"
                               value={risk.risk_group}
                               onChange={handleChange}
                           >

                               {groupOptions.map(group => (

                                   <option
                                       key={group}
                                       value={group}
                                   >
                                       {group || "Select Group"}
                                   </option>
                               ))}

                           </select>

                           <div className="wbs-upload-row">

                               <input
                                   name="wbs_element"
                                   placeholder="WBS Element"
                                   value={risk.wbs_element}
                                   onChange={handleChange}
                               />

                               <input
                                   type="file"
                               />

                           </div>

                         <div className="field-card">

                             <label>Description</label>

                             <p className="field-info">
                                 Write risk in "IF, THEN" statement format.
                             </p>

                             <textarea
                                 className="small-textarea"
                                 name="description"
                                 placeholder="Enter Description"
                                 value={risk.description}
                                 onChange={handleChange}
                             />

                         </div>

                           <select
                               name="risk_probability"
                               value={risk.risk_probability}
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Probability
                               </option>

                               {probabilityOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="risk_consequence"
                               value={risk.risk_consequence}
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Consequence
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="greatest_risk_consequence"
                               value={
                                   risk.greatest_risk_consequence
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Type
                               </option>

                               {greatestConsequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <textarea
                               name="risk_justification"
                               placeholder="Risk Justification"
                               value={risk.risk_justification}
                               onChange={handleChange}
                           />

                           <div>

                               <select
                                   name="risk_response_strategy"
                                   value={
                                       risk.risk_response_strategy
                                   }
                                   onChange={handleChange}
                               >

                                   <option value="">
                                       Select Strategy
                                   </option>

                                   {strategyOptions.map(strategy => (

                                       <option
                                           key={strategy.value}
                                           value={strategy.value}
                                       >
                                           {strategy.value}
                                       </option>
                                   ))}

                               </select>

                               {selectedStrategy && (

                                   <p className="field-info">

                                       {
                                           selectedStrategy.description
                                       }

                                   </p>
                               )}

                           </div>

                          <div className="field-card">

                              <label>Risk Response Actions</label>

                              <p className="field-info">
                                  Use:
                                  [Potential],
                                  [Planned],
                                  [In Progress],
                                  [Executed]
                              </p>

                              <textarea
                                  className="small-textarea"
                                  name="risk_response_actions"
                                  placeholder="Enter Risk Response Actions"
                                  value={risk.risk_response_actions}
                                  onChange={handleChange}
                              />

                          </div>

                           <select
                               name="residual_risk_probability"
                               value={
                                   risk.residual_risk_probability
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Residual Probability
                               </option>

                               {probabilityOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="residual_risk_consequence"
                               value={
                                   risk.residual_risk_consequence
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Residual Consequence
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <textarea
                               name="residual_risk_justification"
                               placeholder="Residual Risk Justification"
                               value={
                                   risk.residual_risk_justification
                               }
                               onChange={handleChange}
                           />

                       </div>
                   </div>

                   {/* SECTION 2 */}

                   <div className="section-card">

                       <h2>Risk Details</h2>

                       <div className="grid-container">

                           <input
                               value={risk.risk_scope}
                               disabled
                           />

                           <select
                               name="risk_consequence_scope"
                               value={
                                   risk.risk_consequence_scope
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Consequence Scope
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <input
                               type="number"
                               name="risk_cost"
                               placeholder="Risk Cost (INR)"
                               value={risk.risk_cost ?? ""}
                               onChange={handleChange}
                           />

                           <input
                               value={risk.risk_consequence_cost}
                               disabled
                           />

                           <div className="schedule-row">

                               <div>

                                   <label>
                                       Schedule Date
                                   </label>

                                   <input
                                       type="date"
                                       name="risk_schedule_start"
                                       value={
                                           risk.risk_schedule_start
                                       }
                                       onChange={handleChange}
                                   />

                               </div>

                               <div>

                                   <label>
                                       Delay Date
                                   </label>

                                   <input
                                       type="date"
                                       name="risk_schedule_end"
                                       value={
                                           risk.risk_schedule_end
                                       }
                                       onChange={handleChange}
                                   />

                               </div>

                           </div>

                           <input
                               value={risk.risk_consequence_schedule}
                               disabled
                           />

                       </div>
                   </div>

                   {/* SECTION 3 */}

                   <div className="section-card">

                       <h2>Residual Risk Details</h2>

                       <div className="grid-container">

                           <select
                               name="residual_risk_consequence_cost"
                               value={
                                   risk.residual_risk_consequence_cost
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Residual Cost
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="residual_risk_consequence_schedule"
                               value={
                                   risk.residual_risk_consequence_schedule
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Residual Schedule
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                           <select
                               name="residual_risk_consequence_scope"
                               value={
                                   risk.residual_risk_consequence_scope
                               }
                               onChange={handleChange}
                           >

                               <option value="">
                                   Select Residual Scope
                               </option>

                               {consequenceOptions.map(option => (

                                   <option
                                       key={option}
                                       value={option}
                                   >
                                       {option}
                                   </option>
                               ))}

                           </select>

                       </div>
                   </div>

                   {/* SECTION 4 */}

                   <div className="section-card">

                       <h2>Others</h2>

                       <div className="grid-container">

                           <textarea
                               name="comment"
                               placeholder="Comment"
                               value={risk.comment}
                               onChange={handleChange}
                           />

                           <input
                               value={risk.created_at}
                               disabled
                           />

                           <input
                               name="submitted_by"
                               placeholder="Submitted By"
                               value={risk.submitted_by}
                               onChange={handleChange}
                           />

                           <input
                               name="risk_owner_name"
                               placeholder="Risk Owner"
                               value={risk.risk_owner_name}
                               onChange={handleChange}
                           />

                       </div>
                   </div>

                   <div className="button-row">

                       <button
                           className="submit-btn"
                           onClick={createRisk}
                       >
                           Create Risk version
                       </button>

                       <button
                           type="button"
                           className="reset-btn"
                           onClick={loadRisk}
                       >
                           Reset
                       </button>

                   </div>

               </div>

    );
}

export default EditRiskPageHelper;