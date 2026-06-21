export type AuditActionType =
  | "PARSE_SUCCESS"
  | "PARSE_FAILURE"
  | "SYSTEM_RESET"
  | "MOCK_DATA_INJECTED"
  | "USER_SUSPENDED"
  | "USER_DELETED";

export interface AuditLog {
  logId: string;
  timestamp: string;
  actionType: AuditActionType;
  details: string;
}

export interface SystemStats {
  totalRecordsParsed:    number;
  activePatientsCount:   number;
  suspendedUsersCount:   number;
  totalAIParseSuccess:   number;
  totalAIParseFailure:   number;
  totalDocsUploaded:     number;
}

export interface SystemSettings {
  maxUploadSizeMB:        number;
  allowedFileTypes:       string[];
  aiProvider:             "gemini" | "openai";
  enableAuditLogging:     boolean;
  enableMockDataOnEmpty:  boolean;
}
