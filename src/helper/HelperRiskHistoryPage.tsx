import { useEffect, useState } from "react";

import { getAllHistory } from "../services/riskService";

import type { RiskHistory } from "../types/riskHistory";

function HelperRiskHistoryPage() {

    const [history, setHistory] =
        useState<RiskHistory[]>([]);

    const loadHistory = async () => {

        try {

            const response =
                await getAllHistory();

            setHistory(
                response as RiskHistory[]
            );

            console.log(  `data history: ${response}`);
            console.table(response);
            

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            await loadHistory();

        };

        void fetchData();

    }, []);

    return (

    <div>

        <h2>
            Risk History
        </h2>

        <p>
            Records: {history.length}
        </p>

        <div
            style={{
                overflowX: "auto",
                maxWidth: "100%"
            }}
        >

            <table
                style={{
                    borderCollapse: "collapse",
                    minWidth: "5000px"
                }}
            >

                <thead>

                    <tr>

                        <th>Record Key</th>
                        <th>Type</th>
                        <th>Parent Key</th>
                        <th>Version No</th>

                        <th>Summary</th>
                        <th>Status</th>
                        <th>Risk Group</th>
                        <th>WBS Element</th>
                        <th>Attachment</th>
                        <th>Description</th>

                        <th>Risk Probability</th>
                        <th>Risk Consequence</th>
                        <th>Greatest Consequence</th>
                        <th>Risk Justification</th>
                        <th>Response Strategy</th>
                        <th>Response Actions</th>

                        <th>Residual Probability</th>
                        <th>Residual Consequence</th>
                        <th>Residual Justification</th>

                        <th>Risk Scope</th>
                        <th>Consequence Scope</th>
                        <th>Risk Cost</th>
                        <th>Consequence Cost</th>

                        <th>Schedule Start</th>
                        <th>Schedule End</th>
                        <th>Consequence Schedule</th>

                        <th>Residual Cost</th>
                        <th>Residual Schedule</th>
                        <th>Residual Scope</th>

                        <th>Comment</th>
                        <th>Created At</th>
                        <th>Risk Owner</th>
                        <th>Submitted By</th>

                        <th>Deleted At</th>
                        <th>Deleted By</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        history.length === 0
                            ? (
                                <tr>

                                    <td colSpan={35}>

                                        No History Found

                                    </td>

                                </tr>
                            )
                            : history.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr key={index}>

                                        <td>{item.record_key ?? "-"}</td>
                                        <td>{item.record_type ?? "-"}</td>
                                        <td>{item.parent_issue_key ?? "-"}</td>
                                        <td>{item.version_no ?? "-"}</td>

                                        <td>{item.summary ?? "-"}</td>
                                        <td>{item.status ?? "-"}</td>
                                        <td>{item.risk_group ?? "-"}</td>
                                        <td>{item.wbs_element ?? "-"}</td>
                                        <td>{item.attached_document_path ?? "-"}</td>
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
                                        <td>{item.created_at ?? "-"}</td>
                                        <td>{item.risk_owner_name ?? "-"}</td>
                                        <td>{item.submitted_by ?? "-"}</td>

                                        <td>{item.deleted_at ?? "-"}</td>
                                        <td>{item.deleted_by ?? "-"}</td>

                                    </tr>
                                )
                            )
                    }

                </tbody>

            </table>

        </div>

    </div>
);
}

export default HelperRiskHistoryPage;