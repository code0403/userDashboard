"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useStore } from "../lib/store";
import * as Switch from "@radix-ui/react-switch";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { loggedInUser } = useStore();
  const toggleActivity = useStore((state) => state.toggleActivity);

  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);



  const initials = loggedInUser
    ? loggedInUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
    : "";

  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 shadow-md ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div
        className={`text-xl font-bold cursor-pointer ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
        onClick={() => router.push("/")}
      >
        User Dashboard
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Switch */}
        <div className="flex items-center gap-2">
          <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            {darkMode ? "Dark Mode" : "Light Mode"}
          </span>
          <Switch.Root
            className={`w-10 h-6 rounded-full relative shadow transition-colors duration-300 ${
              darkMode ? "bg-blue-500" : "bg-gray-300"
            }`}
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          >
            <Switch.Thumb
              className={`block w-4 h-4 bg-white rounded-full shadow transform duration-300
              translate-x-0.5 top-1.5
              ${darkMode ? "translate-x-5" : ""}`}
            />
          </Switch.Root>
        </div>

        {/* Logged-in User */}
        {loggedInUser && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {initials}
            </div>
            <span className={`${darkMode ? "text-gray-100" : "text-gray-800"}`}>
              {loggedInUser.name}
            </span>
          </div>
        )}

        <button
          onClick={toggleActivity}
          className={`p-2 rounded transition-colors duration-200 ${
            darkMode
              ? "hover:bg-gray-700 text-gray-100"
              : "hover:bg-gray-200 text-gray-800"
          }`}
        >
          <HamburgerMenuIcon className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
