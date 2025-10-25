import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BookOpen } from "lucide-react";
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="h-16 flex items-center px-4 border-b">
           <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
             <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M3.5 2.7c.3 0 .6.1.8.4l1.8 2.9v11.5c0 .9-.7 1.6-1.6 1.6H3.5c-.9 0-1.6-.7-1.6-1.6V4.7c0-.9-.7-1.6 1.6-1.6h.1z"></path>
              <path d="M20.5 2.7c-.3 0-.6.1-.8.4l-1.8 2.9v11.5c0 .9.7 1.6 1.6 1.6h1.1c.9 0 1.6-.7 1.6-1.6V4.7c0-.9-.7-1.6-1.6-1.6h-.1z"></path>
              <path d="M8.9 2.1l5.2 2.7c.3.1.5.4.5.8v13.2c0 .5-.3.9-.8 1L8.9 22.5c-.3-.2-.5-.5-.5-.8V2.9c0-.5.3-.9.8-1.2z"></path>
            </svg>
            <span>Scholar Chat</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DashboardNav />
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between md:justify-end px-4 border-b bg-card">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="h-16 flex items-center px-4 border-b">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span>Scholar Chat</span>
                    </Link>
                </div>
                <DashboardNav />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
