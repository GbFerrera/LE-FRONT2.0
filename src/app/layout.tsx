"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
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
  const [open, setOpen] = useState(false);

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
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
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
      label: "Configurações",
      href: "/configuracoes",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Sair",
      href: "/logout",
      icon: (
        <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
  ];

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
        <div className="flex h-screen w-full overflow-hidden">
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
          <main className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="font-bold text-xl text-orange-500 flex items-center space-x-2 py-1"
    >
      <Image
        src="/assets/logole-primaria-bg.png"
        alt="LinkEats Logo"
        width={50}
        height={50}
        className="shrink-0 rounded-lg"
      />
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
      <Image
        src="/assets/logole-primaria-bg.png"
        alt="LinkEats Logo"
        width={50}
        height={50}
        className="shrink-0 rounded-lg"
      />
    </a>
  );
};
