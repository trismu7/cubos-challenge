import { NextRequest, NextResponse } from "next/server";
// import { validateSession } from "./lib/auth/validateSession";
import { openSessionToken } from "./lib/auth/jwt";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const publicRoutes = ["/"];
const protectedRoutes = [`/main`];

export async function middleware(request: NextRequest) {
  const sessionValid = await openSessionToken(
    request.cookies.get("cubos-movies-session")?.value || ""
  );
  const pathname = request.nextUrl.pathname;

  const redirectUrl = "http://localhost:3000"; // change for production

  if (sessionValid && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(redirectUrl + "/main", {
      status: 302,
    });
  }

  if (!sessionValid) {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(redirectUrl, { status: 302 });
    }
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
