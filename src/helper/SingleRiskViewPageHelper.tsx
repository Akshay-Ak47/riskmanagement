import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { openDocument } from "../services/riskService";
import { useNavigate } from "react-router-dom";

import {
    getRiskByKey,
    getRiskVersionByKey
} from "../services/riskService";

import type { RiskMerge } from "../types/riakMerg";

import "../styles/SingleRiskViewPageHelper.css";

function SingleRiskViewPageHelper() {

    const { issueKey } = useParams();

    const [data, setData] =
        useState<RiskMerge | null>(null);

    const navigate = useNavigate();    

    const loadData = async () => {

        if (!issueKey) {
            return;
        }

        try {

            const response =
                issueKey.includes(".")
                    ? await getRiskVersionByKey(issueKey)
                    : await getRiskByKey(issueKey);

            setData(
                response as RiskMerge
            );

        } catch (error) {

            console.error(
                "Failed to load risk:",
                error
            );

            setData(null);
        }
    };

    useEffect(() => {

        const fetchData = async () => {

            await loadData();

        };

        void fetchData();

    }, [issueKey]);

   const renderField = (
    label: string,
    value: unknown
) => (

    <div className="info-card">

        <div className="info-label">
            {label}
        </div>

        <div className="info-value">
            {
                value !== null &&
                value !== undefined &&
                value !== ""
                    ? String(value)
                    : "-"
            }
        </div>

    </div>
);

   if (!data) {

    const isVersionRequest =
        issueKey?.includes(".");

    return (

        <div className="page-container">

            <div className="risk-card">

                <div className="risk-title">

                    {
                        isVersionRequest
                            ? "Risk Version Details"
                            : "Risk Details"
                    }

                </div>

                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#64748b",
                        fontSize: "18px",
                        fontWeight: 500
                    }}
                >
                    No data found
                </div>

            </div>

        </div>
    );
}

    const isVersion = !!data.version_key;

return (
    <div className="page-container">

        <div className="risk-card">

            <div className="risk-title">
                {isVersion
                    ? "Risk Version Details"
                    : "Risk Details"}
            </div>

            <div className="info-grid">

                {
                    isVersion && (
                        <>
                            {renderField("Version Key", data.version_key)}
                            {renderField("Parent Issue Key", data.parent_issue_key)}
                            {renderField("Version Number", data.version_no)}
                        </>
                    )
                }

                {
                    !isVersion && (
                        <div className="info-card">

                            <div className="info-label">
                                Issue Key
                            </div>

                            <div
                                className="info-value issue-key-cell"
                                title="Click to view"
                                onClick={() =>
                                    navigate(`/view/${data.issue_key}`)
                                }
                            >
                                {data.issue_key}
                            </div>

                        </div>
                    )
                }

                <div className="info-card">

                    <div className="info-label">
                        Attached Document
                    </div>

                    <div className="info-value">

                        {
                            data.attached_document_path
                                ? (
                                    <span
                                        className="document-link"
                                        onClick={() =>
                                            openDocument(
                                                data.attached_document_path
                                            )
                                        }
                                    >
                                        View Document
                                    </span>
                                )
                                : "Document not found"
                        }

                    </div>

                </div>

                {renderField("Summary", data.summary)}
                {renderField("Status", data.status)}
                {renderField("Risk Group", data.risk_group)}
                {renderField("WBS Element", data.wbs_element)}
                {renderField("Description", data.description)}
                {renderField("Risk Probability", data.risk_probability)}
                {renderField("Risk Consequence", data.risk_consequence)}
                {renderField("Greatest Risk Consequence", data.greatest_risk_consequence)}
                {renderField("Risk Justification", data.risk_justification)}
                {renderField("Risk Response Strategy", data.risk_response_strategy)}
                {renderField("Risk Response Actions", data.risk_response_actions)}
                {renderField("Residual Risk Probability", data.residual_risk_probability)}
                {renderField("Residual Risk Consequence", data.residual_risk_consequence)}
                {renderField("Residual Risk Justification", data.residual_risk_justification)}
                {renderField("Risk Scope", data.risk_scope)}
                {renderField("Risk Consequence Scope", data.risk_consequence_scope)}
                {renderField("Risk Cost", data.risk_cost)}
                {renderField("Risk Consequence Cost", data.risk_consequence_cost)}
                {renderField("Risk Schedule Start", data.risk_schedule_start)}
                {renderField("Risk Schedule End", data.risk_schedule_end)}
                {renderField("Risk Consequence Schedule", data.risk_consequence_schedule)}
                {renderField("Residual Risk Consequence Cost", data.residual_risk_consequence_cost)}
                {renderField("Residual Risk Consequence Schedule", data.residual_risk_consequence_schedule)}
                {renderField("Residual Risk Consequence Scope", data.residual_risk_consequence_scope)}
                {renderField("Comment", data.comment)}
                {renderField("Risk Owner Name", data.risk_owner_name)}
                {renderField("Submitted By", data.submitted_by)}
                {renderField("Created At", data.created_at)}

            </div>

        </div>

    </div>
);
}

export default SingleRiskViewPageHelper;

