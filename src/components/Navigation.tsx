import { Link, useLocation } from "wouter";
import { Home, Heart, MessageCircle, Wallet, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dating", icon: Heart, label: "Dating" },
    { href: "/couple", icon: MessageCircle, label: "Couple" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href} className="group relative flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className={cn(
                "absolute -top-[1px] w-8 h-1 rounded-b-full bg-primary transition-all duration-300",
                isActive ? "opacity-100 shadow-[0_0_10px_2px_hsl(var(--primary)/0.5)]" : "opacity-0"
              )} />
              <link.icon className={cn(
                "w-6 h-6 transition-all duration-300 mb-1",
                isActive ? "text-primary -translate-y-1" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
