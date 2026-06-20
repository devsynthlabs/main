export const REPORT_FOOTER_COMPANY = "SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED";

export const DEFAULT_REPORT_COMPANY_NAME = "";

export const getReportCompanyName = (companyName?: string) =>
  companyName?.trim() || "Your Company Name";
