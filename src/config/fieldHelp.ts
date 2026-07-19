export const fieldHelp = {
  status: {
    title: "Status",
    options: [
      {
        value: "New",
        description: "Risk identified and added to JIRA."
      },
      {
        value: "Active",
        description: "The risk has been accepted and work is being done on the risk response."
      },
      {
        value: "Retired",
        description: "The risk has been reduced to an acceptable level and no further work is required."
      },
      {
        value: "Withdrawn",
        description: "The risk has not been accepted (for example, duplicate risk)."
      }
    ]
  },

  riskResponseStrategy: {
  title: "Risk Response Strategy",
  options: [
    {
      value: "Avoid",
      description: "Change the project to eliminate the threat from the identified risk."
    },
    {
      value: "Mitigate",
      description: "Take early action to reduce the likelihood and/or impact of the risk."
    },
    {
      value: "Transfer",
      description: "Shift responsibility and ownership of the risk to another party."
    },
    {
      value: "Accept",
      description: "Acknowledge the threat as part of the project and accept the consequences if it occurs."
    }
  ]
},

  consequence: {
    title: "Consequence",
    options: [
      // ...
    ]
  },

  responseStrategy: {
    title: "Response Strategy",
    options: [
      // ...
    ]
  },



  riskCost: {
  title: "Risk Cost (USD)",
  description: "Enter the estimated financial impact of the risk in thousands of US dollars ($K). The system automatically determines the Consequence Cost based on the value entered.",
  options: [
    { value: "$0 - < $100K", description: "Trivial" },
    { value: "$100K - < $1,000K", description: "Low" },
    { value: "$1,000K - < $5,000K", description: "Medium" },
    { value: "$5,000K - < $25,000K", description: "High" },
    { value: "$25,000K and above", description: "Severe" },
  ],
},

schedulePercentage: {
  title: "Schedule Percentage",
  options: [
    { value: "0-5%", description: "Trivial - Minimal schedule delay." },
    { value: "5-10%", description: "Low - Minor schedule delay." },
    { value: "10-25%", description: "Medium - Moderate schedule delay." },
    { value: "25-50%", description: "High - Significant schedule delay." },
    { value: ">50%", description: "Severe - Major schedule delay requiring immediate attention." },
  ],
},

riskScope: {
  title: "Risk Scope Matrix",
 table: [
  ["Consequence Cost ↓ / Consequence Schedule →", "Trivial", "Low", "Medium", "High", "Severe"],
  ["Trivial", "Trivial", "Low", "Medium", "High", "Severe"],
  ["Low", "Low", "Low", "Medium", "High", "Severe"],
  ["Medium", "Medium", "Medium", "Medium", "High", "Severe"],
  ["High", "High", "High", "High", "High", "Severe"],
  ["Severe", "Severe", "Severe", "Severe", "Severe", "Severe"],
],
},

};