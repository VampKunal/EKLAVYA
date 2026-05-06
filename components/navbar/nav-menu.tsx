import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

interface NavMenuProps extends NavigationMenuProps {
  items: {
    label: string;
    href: string;
  }[];
}

export const NavMenu = ({ items, ...props }: NavMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="space-x-8 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      {items.map(({ label, href }) => (
        <NavigationMenuItem key={href}>
          <NavigationMenuLink asChild>
            <Link 
              href={href}
              className="text-[10px] uppercase tracking-[3px] font-bold transition-all hover:text-magenta"
            >
              {label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
