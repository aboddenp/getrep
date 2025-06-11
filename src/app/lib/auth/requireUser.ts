import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// use this helper to insure there is a user data attached to this request 
export function requireUser(req: NextRequest) {
  const user = getAuth(req);
  if (!user.userId) return NextResponse.json({ message: 'Unothorized User' }, { status: 401 })
  return user;
} 
