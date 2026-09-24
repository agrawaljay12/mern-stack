import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
} from "lucide-react";

import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({
  isOpen,
  onClose,
}: AdminSidebarProps) => {
  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "All Blogs",
      path: "/admin/blogs",
      icon: FileText,
    },
    {
      name: "Create Blog",
      path: "/admin/blogs/create",
      icon: PlusCircle,
    },
    {
      name: "Comments",
      path: "/admin/comments",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <NavLink
            to="/admin"
            onClick={onClose}
            className="text-xl font-bold text-gray-900"
          >
            Blog<span className="text-blue-600">Admin</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Blog Management
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 rounded-lg
                    px-3 py-2.5 text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                    `
                  }
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;