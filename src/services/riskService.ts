import { invoke } from "@tauri-apps/api/core";
import type { RiskState } from "../types/risk";
import { showMessage }from "../utils/alertUtils";



export const getRiskByKey = async (
    issueKey: string
) => {

    return await invoke(
        "get_risk_by_key",
        {
            issueKey
        }
    );
};

export const createRiskVersion = async (
    risk: RiskState
) => {

    return await invoke(
        "create_risk_version",
        {
            risk
        }
    );
};



export const getRiskVersions = async (
    parentIssueKey: string
) => {

    return await invoke(
        "get_risk_versions",
        {
            parentIssueKey
        }
    );
};

export const getEditableRisk = async (
    key: string
) => {

    return await invoke(
        "get_editable_risk",
        {
            key
        }
    );
};



export const getAllHistory = async () => {

    try {

        return await invoke(
            "get_all_history"
        );

    } catch (error) {

        console.error(
            "Failed to fetch history:",
            error
        );

        throw error;
    }
};

export const openDocument = async (
    path: string
) => {

    try {

        await invoke(
            "open_document",
            { path }
        );

    } catch (error) {

        showMessage(
            "error",
            "Open Failed",
            String(error)
        );

        throw error;
    }
};


export const handleOperationResult = async (
    operation: () => Promise<unknown>,
    successMessage: string,
    errorMessage: string
): Promise<boolean> => {

    try {

        await operation();

        await showMessage(
            "success",
            successMessage,
            ""
        );

        return true;

    } catch (error) {

        await showMessage(
            "error",
            errorMessage,
            String(error)
        );

        return false;
    }
};

export const getRiskVersionByKey = async (
    versionKey: string
) => {

    try {

        return await invoke(
            "get_risk_version_by_key",
            {
                versionKey
            }
        );

    } catch (error) {

        console.error(
            "Failed to fetch risk version:",
            error
        );

        throw error;
    }
};