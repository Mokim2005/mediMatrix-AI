import { NextRequest, NextResponse } from "next/server";
import {
  parseMedicalDocument,
  mapAIResponseToMedicalRecord,
} from "@/services/ai.service";
import type { MedicalRecord } from "@/types/medical-record";

interface RequestBody {
  fileBase64: string;
  fileType: string;
}

interface SuccessResponse {
  success: true;
  data: MedicalRecord;
}

interface ErrorResponse {
  success: false;
  message: string;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

function isValidBody(body: unknown): body is RequestBody {
  return (
    typeof body === "object" &&
    body !== null &&
    typeof (body as Record<string, unknown>).fileBase64 === "string" &&
    typeof (body as Record<string, unknown>).fileType === "string" &&
    ((body as Record<string, unknown>).fileBase64 as string).length > 0 &&
    ((body as Record<string, unknown>).fileType as string).length > 0
  );
}

export async function POST(
  req: NextRequest
): Promise<
  NextResponse<
    | (SuccessResponse & { auditAction: "PARSE_SUCCESS" })
    | (ErrorResponse & { auditAction: "PARSE_FAILURE" })
  >
> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON in request body.",
        auditAction: "PARSE_FAILURE",
      },
      { status: 400 }
    );
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Request body must contain non-empty fileBase64 and fileType fields.",
        auditAction: "PARSE_FAILURE",
      },
      { status: 400 }
    );
  }

  const { fileBase64, fileType } = body;

  if (!ALLOWED_TYPES.includes(fileType.toLowerCase())) {
    return NextResponse.json(
      {
        success: false,
        message: `Unsupported file type "${fileType}". Allowed: PNG, JPEG, PDF.`,
        auditAction: "PARSE_FAILURE",
      },
      { status: 400 }
    );
  }

  try {
    const rawAI = await parseMedicalDocument(fileBase64, fileType);

    const recordId = `REC-AI-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0] ?? "";

    const record = mapAIResponseToMedicalRecord(rawAI, recordId, today);

    return NextResponse.json(
      {
        success: true,
        data: record,
        auditAction: "PARSE_SUCCESS",
      },
      { status: 200 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        success: false,
        message,
        auditAction: "PARSE_FAILURE",
      },
      { status: 500 }
    );
  }
}
