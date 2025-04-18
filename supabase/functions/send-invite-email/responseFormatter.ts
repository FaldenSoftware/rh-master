
import { corsHeaders } from "./types.ts";

export function responseWithCORS(response: Response): Response {
  // Add CORS headers to the response
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  // Create a new response with the same status, body, but with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
