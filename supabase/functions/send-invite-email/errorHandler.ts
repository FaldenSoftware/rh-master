
import { corsHeaders } from "./types.ts";

export function errorResponse(message: string, details?: Record<string, any>): Response {
  console.error(`Error: ${message}`, details || {});
  
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      details: details || null,
      timestamp: new Date().toISOString(),
      ...details
    }),
    {
      status: 200, // Using 200 even for errors to ensure the client receives the error message
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}
