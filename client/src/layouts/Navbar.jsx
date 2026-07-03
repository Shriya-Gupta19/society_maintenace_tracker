import { Menu, Search, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PAGE_TITLES = {
  "/admin/dashboard": {
    title: "Admin Dashboard",
    subtitle: "Society overview and complaint management",
  },
  "/resident/dashboard": {
    title: "Dashboard",
    subtitle: "Your complaints and society updates at a glance",
  },
  "/admin/complaints": {
    title: "Manage Complaints",
    subtitle: "Review, prioritize, and resolve resident complaints",
  },
  "/resident/complaints": {
    title: "My Complaints",
    subtitle: "Track and manage your submitted complaints",
  },
  "/resident/complaints/create": {
    title: "New Complaint",
    subtitle: "File a maintenance request with category and optional photo",
  },
  "/admin/notices": {
    title: "Manage Notices",
    subtitle: "Create and publish announcements for residents",
  },
  "/resident/notices": {
    title: "Notices",
    subtitle: "Latest announcements from society management",
  },
  "/admin/profile": {
    title: "Profile",
    subtitle: "Manage your account settings",
  },
  "/resident/profile": {
    title: "My Profile",
    subtitle: "Manage your account details",
  },
};

function getPageMeta(pathname) {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  if (pathname.includes("/complaints/")) {
    return {
      title: "Complaint Details",
      subtitle: "Full complaint information and status history",
    };
  }

  return {
    title: "Society Tracker",
    subtitle: "Welcome back",
  };
}

function Navbar({ setSidebarOpen }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { title, subtitle } = getPageMeta(pathname);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = user?.name
    ?.split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="h-16 sm:h-[4.5rem] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden shrink-0 p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
              {title}
            </h1>
            <p className="hidden sm:block text-sm text-slate-500 truncate">
              {subtitle}
            </p>
            <p className="sm:hidden text-xs text-slate-400 truncate">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search..."
              className="w-56 lg:w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {initials || "U"}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block px-4 sm:px-6 lg:px-8 pb-3 -mt-1">
        <p className="text-xs text-slate-400">{today}</p>
      </div>
    </header>
  );
}

export default Navbar;
