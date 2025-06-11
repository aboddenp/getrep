import { NextRequest, NextResponse } from "next/server";

type Handler = (req: NextRequest) => Promise<NextResponse>;

/**
 * Wraps any API handler with centralized error handling.
 */
export function withErrorHandler(handler: Handler) {
  return async function (req: NextRequest): Promise<NextResponse> {
    try {
      return await handler(req);
    } catch (err) {
      console.error("Internal Error:", err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}


