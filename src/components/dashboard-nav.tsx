
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Search,
  LineChart,
  MessageCircle,
  Bookmark,
  FlaskConical,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/trends", label: "Trends", icon: LineChart },
  { href: "/dashboard/chat", label: "Chat", icon: MessageCircle },
  { href: "/dashboard/collections", label: "Collections", icon: Bookmark },
  { href: "/dashboard/hypothesis", label: "Hypothesis", icon: FlaskConical },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardNav() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <nav className="flex flex-col justify-between h-full p-2">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="justify-start"
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5 mr-3" />
              <span className="truncate">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      <div>
        <Button
          variant="ghost"
          className="justify-start w-full"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="truncate">Log out</span>
        </Button>
      </div>
    </nav>
  );
}
