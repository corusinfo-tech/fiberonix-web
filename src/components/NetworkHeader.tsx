// NetworkHeader.tsx
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function NetworkHeader({
  alwaysShowLogo = true,
}: {
  alwaysShowLogo?: boolean;
}) {
  const navigate = useNavigate();
  const { token, name, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true }); // ensures redirect to homepage, not login
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Sidebar button */}
        <div onClick={toggleSidebar}>
          <SidebarTrigger />
        </div>

        {/* Logo Section */}
        {(!isSidebarOpen || alwaysShowLogo) && (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="./Fiberonix Logo 23.png"
              alt="Fiberonix Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="sm:inline text-sm font-medium">
                  {name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleSignOut}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
