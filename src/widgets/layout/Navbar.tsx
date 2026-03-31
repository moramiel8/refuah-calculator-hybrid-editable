import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useLogout } from "@/features/auth";
import NavLinks from "./NavLinks";
import SideMenu from "./SideMenu";
import NotificationBell from "@/features/notifications/ui/NotificationBell";
import { useUnreadMessagesCount } from "@/features/messaging/hooks/useUnreadCount";
import { useFloatingChatStore } from "@/features/floating-chat/store";
import { Stethoscope, MessageCircle } from "lucide-react";
import FriendRequestsBell from "@/features/friends/ui/FriendRequestsBell";

const Navbar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const setMainSidebarOpen = useFloatingChatStore((s) => s.setMainSidebarOpen);
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadMessagesCount(user?.id);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/login");
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
    setMainSidebarOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
    setMainSidebarOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-20 flex h-14 items-center justify-between gradient-header px-3 md:h-16 md:px-5 lg:h-[68px] lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <Stethoscope className="h-8 w-8 md:h-10 md:w-10 text-white dark:text-black transition-transform duration-500 ease-out group-hover:scale-125" />
          {/*<span className="text-lg font-bold tracking-tight text-primary-foreground">מועמדים לרפואה בישראל</span>*/}
        </Link>

        {/* Main nav links - desktop */}
        <NavLinks />

        {/* Right side */}
        <div className="flex items-center gap-2">
          <FriendRequestsBell />
          {user && (
            <button
              onClick={() => navigate("/messages")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
              title="הודעות"
            >
              <MessageCircle className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}
          <NotificationBell />
          {user && (
            <button
              onClick={handleLogout}
              className="hidden items-center gap-1.5 rounded-xl bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20 md:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              התנתקות
            </button>
          )}
          {user ? (
            <button
              onClick={handleOpenMenu}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-primary-foreground/15 px-5 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/25"
            >
              התחברות
            </Link>
          )}
        </div>
      </nav>

      <SideMenu open={menuOpen} onClose={handleCloseMenu} />
    </>
  );
};

export default Navbar;
