import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const cookies = request.cookies.getAll();
    const hasSession = cookies.some(cookie => cookie.name.startsWith('session'));

    const protectedPaths = ["/dashboard", "/profile"];
    const authPaths = ["/login", "/signup", "/auth"];

    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    const isAuthPath = authPaths.some((path) =>
        pathname.startsWith(path)
    );

    // Redirigir a /auth si intenta acceder a ruta protegida sin sesión
    if (isProtectedPath && !hasSession) {
        console.log("❌ Redirigiendo a /login - No hay sesión");
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirigir a /home si intenta acceder a /auth con sesión activa
    if (isAuthPath && hasSession) {
        console.log("✅ Redirigiendo a /dashboard - Ya hay sesión");
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    console.log("⏭️  Continuando sin redirección");
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};