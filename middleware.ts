import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Páginas públicas que não precisam de autenticação
  const publicPages = ['/login', '/register'];
  
  // Verificar se é uma página pública
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));
  
  // Se está tentando acessar uma página pública, permitir
  if (isPublicPage) {
    return NextResponse.next();
  }
  
  // Verificar se tem token de autenticação
  const token = request.cookies.get('auth-token')?.value;
  
  // Se não tem token e não está em página pública, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Adicionar a URL de destino como parâmetro para redirecionar após login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Se tem token, permitir acesso
  return NextResponse.next();
}

export const config = {
  // Aplicar middleware a todas as rotas exceto:
  // - API routes
  // - Arquivos estáticos (_next/static)
  // - Imagens (_next/image)
  // - Favicon
  // - Arquivos públicos (assets, etc.)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};