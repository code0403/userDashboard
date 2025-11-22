"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useStore } from "../lib/store";
import * as Switch from "@radix-ui/react-switch";
import { useRouter } from "next/navigation";

export default function Navbar() {

  const { darkMode, toggleDarkMode, loggedInUser } = useStore();

  const toggleActivity = useStore((state) => state.toggleActivity);

    const router = useRouter();

  const initials = loggedInUser
    ? loggedInUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
    : "";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="text-xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer" onClick={() => router.push("/")}>
        User Dashboard
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Switch */}
        <div className="flex items-center gap-2">
          <span className="text-gray-700 dark:text-gray-300 text-sm">Dark Mode</span>
          <Switch.Root
            className={`w-10 h-6 bg-gray-300 rounded-full relative shadow ${darkMode ? "bg-blue-500" : ""
              }`}
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
          >
            <Switch.Thumb
              className="block w-4 h-4 bg-white rounded-full shadow transform duration-300
              translate-x-0.5 top-1.5
              data-[state=checked]:translate-x-5"
            />
          </Switch.Root>
        </div>

        {/* Logged-in User */}
        {loggedInUser && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {initials}
            </div>
            <span className="text-gray-800 dark:text-gray-100">{loggedInUser.name}</span>
          </div>
        )}

        <button
          onClick={toggleActivity}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <HamburgerMenuIcon className="w-6 h-6 text-gray-800 dark:text-gray-100" />
        </button>
      </div>
    </nav>
  );
}
