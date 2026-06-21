const GEMINI_MODEL = "gemini-2.5-flash";

function getApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ??
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ??
    ""
  );
}

function buildEndpoint(model = GEMINI_MODEL): string {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your .env file."
    );
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

export interface GeminiRequestPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export interface GeminiRequest {
  contents: Array<{
    parts: GeminiRequestPart[];
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

export interface GeminiCallOptions {
  model?: string;
  timeoutMs?: number;
  retries?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 2;
const RATE_LIMIT_STATUS = 429;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callGemini(
  request: GeminiRequest,
  options: GeminiCallOptions = {}
): Promise<string> {
  const {
    model = GEMINI_MODEL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
  } = options;

  const endpoint = buildEndpoint(model);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const backoff = Math.min(1000 * Math.pow(2, attempt - 1), 10_000);
      await sleep(backoff);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === RATE_LIMIT_STATUS) {
        lastError = new Error("Gemini API rate limit exceeded. Please wait and try again.");
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errText}`);
      }

      const json = (await response.json()) as GeminiResponse;

      if (json.promptFeedback?.blockReason) {
        throw new Error(
          `Gemini request blocked: ${json.promptFeedback.blockReason}`
        );
      }

      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      return rawText;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        lastError = new Error(
          `Gemini request timed out after ${timeoutMs}ms.`
        );
        continue;
      }
      if (err instanceof Error) {
        lastError = err;
        if (attempt < retries && isRetryable(err)) continue;
      }
      throw lastError ?? new Error("Unknown Gemini API error.");
    }
  }

  throw lastError ?? new Error("Gemini API request failed after all retries.");
}

function isRetryable(err: Error): boolean {
  const msg = err.message.toLowerCase();
  return (
    msg.includes("rate limit") ||
    msg.includes("timeout") ||
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("500")
  );
}
