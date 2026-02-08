"use client";

import {
  LogOut,
  User,
  ChevronsUpDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Cookies from "react-cookies";
import { useEffect, useState } from "react";
import Image from "next/image";
import { logout } from "@/app/commonApi.js";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

export function NavUser({ user }) {
  const name = Cookies.load("name")
    ? atob(Cookies.load("name"))
    : Cookies.load("authority_user_desigantion")
      ? Cookies.load("authority_user_desigantion")
      : null;

  const user_type = Cookies.load("user_type");
  const authority_boundary_name = Cookies.load("boundary_name");
  const authority_user_type = Cookies.load("authority_user_type_id");

  const [cookieData, setCookieData] = useState({});
  const [hasImageError, setHasImageError] = useState(false);
  const { isMobile } = useSidebar();
  const router = useRouter(); // This works in App Router

  useEffect(() => {
    try {
      const pic = localStorage.getItem("pic");
      setCookieData({
        type: user_type,
        name,
        pic,
        authority_boundary_name,
        authority_user_type,
      });
    } catch (error) {
      setCookieData({});
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log("Logout response:", response);

      // Check if logout was successful
      if (response && response.status === 0) {
        console.log("Logout successful");
        router.push("/"); // Navigate to homepage on success
      } else {
        // Handle unexpected response
        console.error("Unexpected logout response:", response);
        router.push("/"); // Still redirect, or handle differently
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally still redirect even on error, or show an error message
      router.push("/");
    }
  };

  const displayUser = {
    ...cookieData,
    ...user,
  };

  const validImageSrc = displayUser?.pic
    ? `data:image/png;base64,${displayUser.pic}`
    : displayUser?.avatar;

  const UserAvatar = ({ className }) => (
    <div className={`relative flex shrink-0 overflow-hidden rounded-lg bg-slate-200 text-slate-600 ${className}`}>
      {validImageSrc && !hasImageError ? (
        <Image
          src={validImageSrc}
          alt="Avatar"
          fill
          className="aspect-square h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-sidebar-primary-foreground text-sidebar-primary">
          <User className="size-4" />
        </div>
      )}
    </div>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar className="h-8 w-8" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {displayUser?.name || "User"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar className="h-8 w-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {displayUser?.name || "User"}
                  </span>
                  <span className="truncate text-xs">
                    {displayUser?.type
                      ? displayUser?.type
                      : displayUser?.authority_boundary_name || "N/A"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            {displayUser?.authority_user_type != 20 && (
              <Link href="/profile">
                {/* Optional Profile Link */}
              </Link>
            )}

            <DropdownMenuSeparator />

            <Button
              variant="ghost"
              className="w-full justify-start px-0 hover:bg-transparent"
              onClick={handleLogout}
            >
              <DropdownMenuItem className="w-full cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}