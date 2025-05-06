"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const routes = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Library", path: "/dashboard/library" },
  { name: "Videos & Quiz", path: "/dashboard/videos-quiz" },
  { name: "Glossary", path: "/dashboard/glossary" },
  { name: "Settings", path: "/dashboard/settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white w-full shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 flex justify-between md:justify-normal md:gap-12 lg:gap-24 items-center">
        {/* logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={0}
            height={0}
            className="w-24 h-auto"
          />
        </Link>

        {/* desktop links */}
        <div className="hidden md:flex gap-6 lg:gap-12">
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.path}
              className={`font-medium text-sm md:text-base ${
                pathname.startsWith(route.path)
                  ? "text-blue-500"
                  : "text-gray-700"
              } hover:text-blue-500 transition`}
            >
              {route.name}
            </Link>
          ))}
        </div>

        {/* mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-inner absolute w-full h-screen z-10">
          <div className="flex flex-col px-4 py-2 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.name}
                href={route.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 px-2 rounded-md font-medium text-sm ${
                  pathname === route.path
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-700 hover:bg-gray-100"
                } transition`}
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
