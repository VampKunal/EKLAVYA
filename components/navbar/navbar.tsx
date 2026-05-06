import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { NavMenu } from "@/components/navbar/nav-menu";
import ThemeToggle from "@/components/navbar/theme-toggle";
import { navItems } from "@/constants";
import { Logo } from "@/components/navbar/logo";
import { NavSheet } from "@/components/navbar/nav-sheet";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    return (
        <nav className="bg-background/80 backdrop-blur-md border-b border-white/5 z-50 sticky top-0">
            <div className="flex justify-between items-center w-full px-6 md:px-10 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-6 md:gap-12">
                    <Logo />
                    <NavMenu className="md:block hidden" items={navItems} />
                </div>
                
                <div className="flex items-center gap-6 md:gap-10">
                    <ThemeToggle />
                    
                    <div className="flex items-center gap-4">
                        <SignedOut>
                            <SignInButton>
                                <Button variant="outline" className="text-[10px] uppercase tracking-[2px] font-bold border-white/10 hover:bg-magenta hover:text-white transition-all">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                        <NavSheet />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
