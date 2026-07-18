import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lexora has no sign-in flow (matching the reference app, which has none
// either) — every visitor gets a persistent anonymous device id instead of
// an account, so saved words/streaks/etc. work immediately with no login
// step. Not a tracking/ad identifier — purely first-party app state.
const COOKIE_NAME = "lexora_uid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export default function middleware(request: NextRequest) {
  if (request.cookies.get(COOKIE_NAME)?.value) {
    return NextResponse.next();
  }

  const uid = crypto.randomUUID();

  // Set on the request too, so the page render in *this* request already
  // sees the id instead of waiting for the next round trip.
  request.cookies.set(COOKIE_NAME, uid);

  const response = NextResponse.next({ request });
  response.cookies.set(COOKIE_NAME, uid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_YEAR,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
