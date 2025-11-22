import { type NextRequest, NextResponse } from "next/server";
import { getUrl } from "./lib/get-url";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  if ((pathname === "/" || pathname.includes("/app")) && !token) {
    return NextResponse.redirect(new URL(getUrl("/auth")));
  }

  if ((pathname === "/auth" || pathname === "/") && token) {
    return NextResponse.redirect(new URL(getUrl("/app")));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
