import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import Logo from "@/assets/Logo.svg";
import { Home } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
  return (
    <nav className="z-20 w-full sticky top-0 mb-2 backdrop-blur bg-background/50 mt-1.5">
      <ul className="flex justify-between space-x-3">
        <li>
          <Link to={"/"}>
            <img className="h-12 w-12" src={Logo} alt="Logo" />
          </Link>
        </li>
        <li>
          <div className="flex space-x-2 mt-1">
            <NavLink to="/">
              {({ isActive, isPending, isTransitioning }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  disabled={isPending || isTransitioning}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              )}
            </NavLink>
            <DarkModeToggle />
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
