// import {
//     useEffect,
//     useState
// } from "react";

// import { useNavigate } from "react-router-dom";
// import type { RiskState } from "../types/risk";



// import {
//     invoke
// } from "@tauri-apps/api/core";

// import "../styles/HelperHome.css";

// function HelperHome() {

//     const [risks, setRisks] =
//         useState<RiskState[]>([]);

// const navigate = useNavigate();

//     const loadRisks = async () => {

//         try {

//             const response =
//                 await invoke(
//                     "get_risks"
//                 );

//             setRisks(
//                  response as RiskState[]
//             );

//         } catch (error) {

//             console.error(error);
//         }
//     };

//     const deleteRisk = async (
//         issueKey: string
//     ) => {

//         if (
//             !window.confirm(
//                 `Delete ${issueKey}?`
//             )
//         ) {
//             return;
//         }

//         try {

//             await invoke(
//                 "delete_risk",
//                 {
//                     issueKey
//                 }
//             );

//             await loadRisks();

//         } catch (error) {

//             console.error(error);
//         }
//     };

//    useEffect(() => {
//     const fetchRisks = async () => {
//         try {

//             const response =
//                 await invoke(
//                     "get_risks"
//                 );

//             setRisks(
//                 response as RiskState[]
//             );

//         } catch (error) {

//             console.error(error);
//         }
//     };

//     void fetchRisks();
// }, []);

//     return (

//         <div className="home-container">

//             <h1>
//                 Risk Register
//             </h1>

//             {
//                 risks.length === 0 && (

//                     <div className="empty-card">

//                         No Risks Found

//                     </div>
//                 )
//             }

//             {
//                 risks.map(
//                     (risk) => (

//                         <div
//                             key={
//                                 risk.issue_key
//                             }
//                             className="risk-card"
//                         >

//                             <div className="risk-header">

//                                 <div>

//                                     <h2>
//                                         {
//                                             risk.issue_key || "-"
//                                         }
//                                     </h2>

//                                     <p>
//                                         {
//                                             risk.summary || "-"
//                                         }
//                                     </p>

//                                 </div>

//                                 <div>

//                                    <button
//                                                                                            className="edit-btn"
//                                                                                            onClick={() =>
//                                                                                                navigate(
//                                                                                                    `/edit/${risk.issue_key}`
//                                                                                                )
//                                                                                            }
//                                                                                        >
//                                                                                            Edit
//                                                                                        </button>

//                                     <button
//                                         className="delete-btn"
//                                         onClick={() =>
//                                             deleteRisk(
//                                                 risk.issue_key
//                                             )
//                                         }
//                                     >
//                                         Delete
//                                     </button>

//                                 </div>

//                             </div>

//                             <div className="details-grid">

//                                 <div><strong>Status</strong><span>{risk.status || "-"}</span></div>

//                                 <div><strong>Risk Group</strong><span>{risk.risk_group || "-"}</span></div>

//                                 <div><strong>WBS Element</strong><span>{risk.wbs_element || "-"}</span></div>

//                                 <div><strong>Description</strong><span>{risk.description || "-"}</span></div>

//                                 <div><strong>Probability</strong><span>{risk.risk_probability || "-"}</span></div>

//                                 <div><strong>Consequence</strong><span>{risk.risk_consequence || "-"}</span></div>

//                                 <div><strong>Greatest Consequence</strong><span>{risk.greatest_risk_consequence || "-"}</span></div>

//                                 <div><strong>Justification</strong><span>{risk.risk_justification || "-"}</span></div>

//                                 <div><strong>Strategy</strong><span>{risk.risk_response_strategy || "-"}</span></div>

//                                 <div><strong>Response Actions</strong><span>{risk.risk_response_actions || "-"}</span></div>

//                                 <div><strong>Residual Probability</strong><span>{risk.residual_risk_probability || "-"}</span></div>

//                                 <div><strong>Residual Consequence</strong><span>{risk.residual_risk_consequence || "-"}</span></div>

//                                 <div><strong>Residual Justification</strong><span>{risk.residual_risk_justification || "-"}</span></div>

//                                 <div><strong>Risk Scope</strong><span>{risk.risk_scope || "-"}</span></div>

//                                 <div><strong>Consequence Scope</strong><span>{risk.risk_consequence_scope || "-"}</span></div>

//                                 <div><strong>Risk Cost</strong><span>{risk.risk_cost || "-"}</span></div>

//                                 <div><strong>Consequence Cost</strong><span>{risk.risk_consequence_cost || "-"}</span></div>

//                                 <div><strong>Schedule Start</strong><span>{risk.risk_schedule_start || "-"}</span></div>

//                                 <div><strong>Schedule End</strong><span>{risk.risk_schedule_end || "-"}</span></div>

//                                 <div><strong>Consequence Schedule</strong><span>{risk.risk_consequence_schedule || "-"}</span></div>

//                                 <div><strong>Residual Cost</strong><span>{risk.residual_risk_consequence_cost || "-"}</span></div>

//                                 <div><strong>Residual Schedule</strong><span>{risk.residual_risk_consequence_schedule || "-"}</span></div>

//                                 <div><strong>Residual Scope</strong><span>{risk.residual_risk_consequence_scope || "-"}</span></div>

//                                 <div><strong>Comment</strong><span>{risk.comment || "-"}</span></div>

//                                 <div><strong>Created At</strong><span>{risk.created_at || "-"}</span></div>

//                                 <div><strong>Risk Owner</strong><span>{risk.risk_owner_name || "-"}</span></div>

//                                 <div><strong>Submitted By</strong><span>{risk.submitted_by || "-"}</span></div>

//                             </div>

//                         </div>
//                     )
//                 )
//             }

//         </div>
//     );
// }

// export default HelperHome;