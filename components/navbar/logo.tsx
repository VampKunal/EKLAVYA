import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="font-display text-2xl md:text-3xl font-black tracking-tighter uppercase whitespace-nowrap hover:opacity-80 transition-opacity">
    Neural<span className="text-magenta">_Learn</span>
  </Link>
);
