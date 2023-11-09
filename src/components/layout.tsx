import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/libs/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navList = [
    {
      title: "Examples",
      url: "/example",
    },
    {
      title: "About",
      url: "/about",
    },
  ];

  const pathname = usePathname();
  const highlightKey = pathname;

  return (
    <>
      <header className="absolute top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-6 flex items-center space-x-2">
            <Link href="/" className="hidden font-bold sm:inline-block">
              Langchain JS
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navList.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  highlightKey !== item.url && "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4"></div>
        </div>
      </header>
      <main className="h-screen pt-16">{children}</main>
    </>
  );
}
