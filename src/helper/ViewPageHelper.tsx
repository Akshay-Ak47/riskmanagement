import { useParams } from "react-router-dom";
import { getRiskByKey, getRiskVersions } from "../services/riskService";
import { useCallback, useEffect, useState } from "react";

import type { RiskViewState } from "../types/riskView";
import type { RiskVersionState } from "../types/riskVersion";

import {
    openDocument
} from "../services/riskService";

import "../styles/ViewPageHelper.css";

function ViewPageHelper() {

    const { issueKey } = useParams();

    const [risk, setRisk] =
        useState<RiskViewState | null>(null);

    const [versions, setVersions] =
        useState<RiskVersionState[]>([]);

    const loadRisk = useCallback(async () => {

        const response =
            await getRiskByKey(
                issueKey as string
            );

        setRisk(
            response as RiskViewState
        );

    }, [issueKey]);

    const loadVersions = useCallback(async () => {

        const response =
            await getRiskVersions(
                issueKey as string
            );

        setVersions(
            response as RiskVersionState[]
        );

    }, [issueKey]);

    useEffect(() => {

        const fetchData = async () => {

            await loadRisk();

            await loadVersions();

        };

        void fetchData();

    }, [loadRisk, loadVersions]);

    return (

       <div className="view-container">

    <h1>
        Risk Details & Version History
    </h1>

    <table className="risk-table">

        <thead>

            <tr>

                <th>Issue / Version Key</th>
                <th>Summary</th>
                <th>Status</th>
                <th>Risk Group</th>
                <th>WBS Element</th>
                <th>Attached Document</th>
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
                <th>Risk Owner</th>
                <th>Submitted By</th>
                <th>Created At</th>

            </tr>

        </thead>

        <tbody>

            {risk && (

                <tr className="main-risk-row">

                    <td>{risk.issue_key}</td>
                    <td>{risk.summary}</td>
                    <td>{risk.status}</td>
                    <td>{risk.risk_group}</td>
                    <td>{risk.wbs_element}</td>
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
                    <td>{risk.description}</td>
                    <td>{risk.risk_probability}</td>
                    <td>{risk.risk_consequence}</td>
                    <td>{risk.greatest_risk_consequence}</td>
                    <td>{risk.risk_justification}</td>
                    <td>{risk.risk_response_strategy}</td>
                    <td>{risk.risk_response_actions}</td>
                    <td>{risk.residual_risk_probability}</td>
                    <td>{risk.residual_risk_consequence}</td>
                    <td>{risk.residual_risk_justification}</td>
                    <td>{risk.risk_scope}</td>
                    <td>{risk.risk_consequence_scope}</td>
                    <td>{risk.risk_cost}</td>
                    <td>{risk.risk_consequence_cost}</td>
                    <td>{risk.risk_schedule_start}</td>
                    <td>{risk.risk_schedule_end}</td>
                    <td>{risk.risk_consequence_schedule}</td>
                    <td>{risk.residual_risk_consequence_cost}</td>
                    <td>{risk.residual_risk_consequence_schedule}</td>
                    <td>{risk.residual_risk_consequence_scope}</td>
                    <td>{risk.comment}</td>
                    <td>{risk.risk_owner_name}</td>
                    <td>{risk.submitted_by}</td>
                    <td>{risk.created_at}</td>

                </tr>

            )}

            {versions.map(version => (

                <tr
                    key={version.version_key ?? ""}
                >

                    <td>{version.version_key}</td>
                    <td>{version.summary}</td>
                    <td>{version.status}</td>
                    <td>{version.risk_group}</td>
                    <td>{version.wbs_element}</td>
                    <td
                        className={
                            version.attached_document_path
                                ? "document-link"
                                : ""
                        }
                        onClick={() =>
                            version.attached_document_path &&
                            openDocument(
                                version.attached_document_path
                            )
                        }
                    >
                        {
                            version.attached_document_path
                                ? "View Document"
                                : "Document not found"
                        }
                    </td>
                    <td>{version.description}</td>
                    <td>{version.risk_probability}</td>
                    <td>{version.risk_consequence}</td>
                    <td>{version.greatest_risk_consequence}</td>
                    <td>{version.risk_justification}</td>
                    <td>{version.risk_response_strategy}</td>
                    <td>{version.risk_response_actions}</td>
                    <td>{version.residual_risk_probability}</td>
                    <td>{version.residual_risk_consequence}</td>
                    <td>{version.residual_risk_justification}</td>
                    <td>{version.risk_scope}</td>
                    <td>{version.risk_consequence_scope}</td>
                    <td>{version.risk_cost}</td>
                    <td>{version.risk_consequence_cost}</td>
                    <td>{version.risk_schedule_start}</td>
                    <td>{version.risk_schedule_end}</td>
                    <td>{version.risk_consequence_schedule}</td>
                    <td>{version.residual_risk_consequence_cost}</td>
                    <td>{version.residual_risk_consequence_schedule}</td>
                    <td>{version.residual_risk_consequence_scope}</td>
                    <td>{version.comment}</td>
                    <td>{version.risk_owner_name}</td>
                    <td>{version.submitted_by}</td>
                    <td>{version.created_at}</td>

                </tr>

            ))}

        </tbody>

    </table>

    {versions.length === 0 && (

        <div className="empty-message">

            No versions available for this risk.

        </div>

    )}

</div>
    );
}

export default ViewPageHelper;