import {
  Calendar,
  CalendarDays,
  MessagesSquare,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

export const mainNavigation = [
  { href: "/people", label: "People", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/groups", label: "Groups", icon: UsersRound },
  { href: "/messages", label: "Messages", icon: MessagesSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
] as const;

export const profileNavigation = {
  href: "/profile",
  label: "Profile",
  icon: UserRound,
} as const;

export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
