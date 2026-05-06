import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { navItems } from "@/constants";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const NavSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-morphism border-l border-white/10 p-10 flex flex-col">
        <Logo />
        <div className="flex flex-col gap-8 mt-16">
          {navItems.map(({label, href}) => 
            <Link 
              key={label} 
              href={href}
              className="text-4xl font-black uppercase tracking-tighter hover:text-magenta transition-colors"
            >
              {label}
            </Link>
          )}
          <SignedOut>
            <SignInButton>
              <Button variant="outline" className="mt-4 text-[10px] uppercase tracking-[3px] font-bold border-white/10 hover:bg-magenta hover:text-white transition-all">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};
