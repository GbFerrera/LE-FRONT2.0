'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Páginas públicas que não precisam de proteção
  const publicPages = ['/login', '/register'];
  const isPublicPage = publicPages.some(page => pathname.startsWith(page));

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (isLoading) {
      return;
    }

    // Se é uma página pública, não precisa verificar autenticação
    if (isPublicPage) {
      setIsChecking(false);
      return;
    }

    // Se não está autenticado e não é página pública, redirecionar para login
    if (!isAuthenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    // Se chegou até aqui, está tudo ok
    setIsChecking(false);
  }, [isAuthenticated, isLoading, isPublicPage, pathname, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado e não é página pública, não renderizar nada
  // (o useEffect já fez o redirecionamento)
  if (!isAuthenticated && !isPublicPage) {
    return null;
  }

  // Renderizar o conteúdo
  return <>{children}</>;
}