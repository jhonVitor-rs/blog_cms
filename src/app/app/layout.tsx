"use client";

import { FileImage, FileText, NotebookText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // ou sua função de merge

const navItems = [
  {
    href: "/app/posts",
    label: "Posts",
    icon: FileText,
  },
  {
    href: "/app/images",
    label: "Images",
    icon: FileImage,
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <main className="relative min-h-screen w-full flex flex-col">
      <header className="bg-primary text-primary-foreground w-full border-b">
        <div className="container mx-auto px-4">
          {/* Logo/Title */}
          <section className="flex items-center gap-3 py-3 border-b border-primary-foreground/10">
            <NotebookText className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Blog CMS</h1>
          </section>

          {/* Navigation */}
          <nav className="flex items-center gap-1 py-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                    "hover:bg-primary-foreground/10",
                    isActive
                      ? "bg-primary-foreground/20 font-medium"
                      : "text-primary-foreground/80"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">{children}</div>
    </main>
  );
}
