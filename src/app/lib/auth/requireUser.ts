import { getAuth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

type RequireUserSuccess = {
  ok: true;
  userId: string;
};

type RequireUserFailure = {
  ok: false;
  response: NextResponse;
};

type RequireUserResult = RequireUserSuccess | RequireUserFailure;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type prettyRequireUserResult = Prettify<RequireUserResult>

export function requireUser(req: NextRequest): prettyRequireUserResult {
  const { userId } = getAuth(req);

  if (!userId) {
    const response = NextResponse.json(
      { message: "Unauthorized User" },
      { status: 401 }
    );
    return { ok: false, response };
  }

  return { ok: true, userId }

}
