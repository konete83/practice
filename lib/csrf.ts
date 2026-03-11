import { NextRequest, NextResponse } from "next/server";

/**
 * Validates that the request includes a custom header to prevent CSRF.
 * Browsers block cross-origin requests from setting custom headers
 * unless the server explicitly allows it via CORS, so requiring this
 * header ensures the request came from our own frontend.
 */
export function csrfCheck(request: NextRequest): NextResponse | null {
  const contentType = request.headers.get("content-type");
  const requestedWith = request.headers.get("x-requested-with");

  if (contentType?.includes("application/json") || requestedWith) {
    return null;
  }

  return NextResponse.json(
    { error: "Invalid request. Missing required headers." },
    { status: 403 }
  );
}
