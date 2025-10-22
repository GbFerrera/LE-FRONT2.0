"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconHome,
  IconUsers,
  IconShoppingCart,
  IconChartBar,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { User, Users, Package } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          "font-sans",
          geistSans.variable,
          geistMono.variable,
          "antialiased"
        )}
      >
        <AuthProvider>
          <ProtectedRoute>
            <LayoutContent>{children}</LayoutContent>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  // Páginas onde a sidebar não deve aparecer
  const hideSidebarPages = ['/login', '/register'];
  const shouldHideSidebar = hideSidebarPages.includes(pathname);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redirecionar para login
      window.location.href = '/login';
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Produtos",
      href: "/produtos",
      icon: (
        <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Usuarios",
      href: "/usuarios",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Mesas",
      href: "/mesas",
      icon: (
        <IconShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Comandas",
      href: "/comandas",
      icon: (
        <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Clientes",
      href: "/clientes",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Configurações",
      href: "/configuracoes",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Sair",
      href: "#",
      icon: (
        <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {!shouldHideSidebar && (
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "LinkEats Admin",
                  href: "#",
                  icon: (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      LE
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      )}
      <main className={cn(
        "flex-1 overflow-y-auto bg-white dark:bg-neutral-900",
        shouldHideSidebar ? "w-full" : ""
      )}>
        {children}
      </main>
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="font-bold text-xl text-orange-500 flex items-center space-x-2 py-1"
    >
      <div className="h-7 w-7 bg-orange-500 rounded-md shrink-0" />
      <span className="whitespace-pre">LinkEats</span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="/"
      className="font-bold text-xl text-orange-500 flex items-center space-x-2 py-1"
    >
      <div className="h-7 w-7 bg-orange-500 rounded-md shrink-0" />
    </a>
  );
};