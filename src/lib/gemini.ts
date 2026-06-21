// Gemini API configuration — uses raw fetch (no SDK dependency required)
// Call parseMedicalDocument() from services/ai.service.ts for actual requests.

export const GEMINI_MODEL = "gemini-2.5-flash";

export function getGeminiApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ??
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ??
    ""
  );
}

export function getGeminiEndpoint(model = GEMINI_MODEL): string {
  const key = getGeminiApiKey();
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}
