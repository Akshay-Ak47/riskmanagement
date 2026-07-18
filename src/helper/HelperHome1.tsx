import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";
import type { RiskViewState } from "../types/riskView";
import Swal from "sweetalert2";



import {
    invoke
} from "@tauri-apps/api/core";

import "../styles/HelperHome1.css";

function HelperHome1() {

    const [risks, setRisks] =
        useState<RiskViewState[]>([]);

      const navigate = useNavigate();

    const loadRisks = async () => {

        try {

            const response =
                await invoke(
                    "get_risks"
                );

            setRisks(
                response as RiskViewState[]
            );

        } catch (error) {

            console.error(error);
        }
    };

   const deleteRisk = async (
    issueKey: string
) => {

const result = await Swal.fire({
    title: "Delete Risk",
    text: `Are you sure you want to delete risk ${issueKey} ? Please enter your name to continue.`,
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
    }
});

    if (!result.isConfirmed) {
        return;
    }

    const deletedBy = result.value;

    try {

        await invoke(
            "delete_risk",
            {
                issueKey,
                deletedBy
            }
        );

        await Swal.fire({
            icon: "success",
            title: "Deleted",
            text: `${issueKey} deleted successfully`,
            timer: 2000,
            showConfirmButton: false
        });

        loadRisks();

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: String(error)
        });
    }
};

    useEffect(() => {
    const fetchRisks = async () => {
        await loadRisks();
    };

    void fetchRisks();
}, []);

    return (

        <div className="home-container">

            <h1>
                Risk Register
            </h1>

            {
                risks.length === 0 && (

                    <div className="empty-card">

                        No Risks Found

                    </div>
                )
            }

            {
                risks.length > 0 && (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>Issue Key</th>
                                    <th>Summary</th>
                                    <th>Status</th>
                                    <th>Risk Group</th>
                                    {/* <th>WBS Element</th>
                                    <th>attached_document</th>
                                    <th>Description</th>
                                    <th>Probability</th>
                                    <th>Consequence</th>
                                    <th>Greatest Consequence</th>
                                    <th>Justification</th>
                                    <th>Strategy</th>
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
                                    <th>Residual Scope</th> */}
                                    <th>Comment</th>
                                    <th>Created At</th>
                                    <th>Risk Owner</th>
                                    <th>Submitted By</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    risks.map(
                                        (
                                            risk
                                        ) => (

                                            <tr
                                                key={
                                                    risk.issue_key
                                                }
                                            >

                                               <td
    className="issue-key-cell"
    title="Click to view"
    onClick={() =>
        navigate(
            `/single/${risk.issue_key}`
        )
    }
>
    {risk.issue_key}
</td>
                                                <td>{risk.summary || "-"}</td>
                                                <td>{risk.status || "-"}</td>
                                                <td>{risk.risk_group || "-"}</td>
                                                {/* <td>{risk.wbs_element || "-"}</td>
                                                <td
    className={
        risk.attached_document_path
            ? "document-link"
            : ""
    }
    onClick={() =>
        risk.attached_document_path &&
        openDocument(
            risk.attached_document_path
        )
    }
>
    {
        risk.attached_document_path
            ? "View Document"
            : "Document not found"
    }
</td>
                                                <td>{risk.description || "-"}</td>
                                                <td>{risk.risk_probability || "-"}</td>
                                                <td>{risk.risk_consequence || "-"}</td>
                                                <td>{risk.greatest_risk_consequence || "-"}</td>
                                                <td>{risk.risk_justification || "-"}</td>
                                                <td>{risk.risk_response_strategy || "-"}</td>
                                                <td>{risk.risk_response_actions || "-"}</td>
                                                <td>{risk.residual_risk_probability || "-"}</td>
                                                <td>{risk.residual_risk_consequence || "-"}</td>
                                                <td>{risk.residual_risk_justification || "-"}</td>
                                                <td>{risk.risk_scope || "-"}</td>
                                                <td>{risk.risk_consequence_scope || "-"}</td>
                                                <td>{risk.risk_cost || "-"}</td>
                                                <td>{risk.risk_consequence_cost || "-"}</td>
                                                <td>{risk.risk_schedule_start || "-"}</td>
                                                <td>{risk.risk_schedule_end || "-"}</td>
                                                <td>{risk.risk_consequence_schedule || "-"}</td>
                                                <td>{risk.residual_risk_consequence_cost || "-"}</td>
                                                <td>{risk.residual_risk_consequence_schedule || "-"}</td>
                                                <td>{risk.residual_risk_consequence_scope || "-"}</td> */}
                                                <td>{risk.comment || "-"}</td>
                                                <td>{risk.created_at || "-"}</td>
                                                <td>{risk.risk_owner_name || "-"}</td>
                                                <td>{risk.submitted_by || "-"}</td>

                                                <td>
                                                   

                                    

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit/${risk.issue_key}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            deleteRisk(
                                                                risk.issue_key
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>
                                        )
                                    )
                                }

                            </tbody>

                        </table>

                    </div>
                )
            }

        </div>
    );
}

export default HelperHome1;