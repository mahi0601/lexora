import { NextResponse } from "next/server";

// Clerk auth is temporarily disabled for local dev; sign-in/sign-up/My Words
// routes are removed for now, so there's nothing left to gate.
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
