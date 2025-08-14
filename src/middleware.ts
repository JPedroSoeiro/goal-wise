import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUrl } from "../src/helpers/get-url";

export async function middleware(request: NextRequest) {
  // Recupera o token JWT original da sessão usando next-auth/jwt
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;

  // Verifica se existe token e se o token é válido
  const isValidToken =
    token && token.accessToken
      ? await validateTokenMiddleware(String(token.accessToken))
      : false;

  // Condição para redirecionar usuários com `confirmed false`
  if (token?.confirmed === false && isValidToken && pathname !== "/dashboard") {
    return NextResponse.redirect(new URL(getUrl("/dashboard")));
  }

  // Se existir o token, tenta validá-lo
  if (token && isValidToken) {
    // Se o token for válido e o usuário estiver tentando acessar a página inicial, redireciona para o dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL(getUrl("/dashboard")));
    }

    // Permite continuar para rotas protegidas
    return NextResponse.next();
  }

  // Se o usuário não tiver um token válido e está tentando acessar uma página protegida
  if (
    (!token || !isValidToken) &&
    pathname !== "/" &&
    pathname !== "/recuperar-senha" &&
    !pathname.startsWith("/redefinir-senha/") &&
    !pathname.startsWith("/login-token/")
  ) {
    const url = new URL(getUrl("/"));
    url.searchParams.set("error", "invalid_token");
    return NextResponse.redirect(url);
  }

  // Permite continuar para outras rotas não protegidas
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

// Função para validar o token no middleware
// async function validateTokenMiddleware(accessToken: string) {
//   try {
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-student-token`;

//     const res = await fetch(url, {
//       method: "POST",
//       body: JSON.stringify({ TOKEN: accessToken }),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Verificando o status da resposta
//     if (res.status === 401) {
//       return false; // Token inválido
//     }

//     const data = await res.json(); // Pegando o corpo da resposta

//     if (data.IS_VALID) {
//       return true; // Token válido
//     } else {
//       return false; // Token inválido
//     }
//   } catch (error) {
//     console.error("Erro ao validar o token no middleware:", error);
//     return false; // Em caso de erro, considera o token como inválido
//   }
// }
