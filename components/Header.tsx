"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.png" alt="logo" width={60} height={60} />
      </Link>
      <ul className="flex flex-row items-center gap-4">
        <li>
          <Link
            href="/dashboard"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/dashboard" ? "text-green-500" : "text-gray-400"
            )}
          >
            Dashboard
          </Link>
        </li>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base cursor-pointer capitalize text-gray-400">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-48">
                <ul className="p-4 rounded shadow-lg">
                  <li className="hover:underline">
                    <Link
                      href="/self-diagnosis"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink>Self Diagnosis</NavigationMenuLink>
                    </Link>
                  </li>
                  <li className="hover:underline mt-2">
                    <Link href="/Emergency-Resources" legacyBehavior passHref>
                      <NavigationMenuLink>
                        Emergency Resources
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <li>
          <Link
            href="/social-campaigns"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/social-campaigns"
                ? "text-green-500"
                : "text-gray-400"
            )}
          >
            Social Campaigns
          </Link>
        </li>
        <li className="ml-2">
          <ModeToggle />
        </li>
        <li>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
