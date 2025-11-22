"use client";

import { useEffect } from "react";
import "./globals.css";
import Providers from "./providers";
import { useStore } from "./lib/store";
import Navbar from "./components/Navbar";
import ActivitySidebar from "./components/ActivitySidebar";


export default function ClientLayout({ children, }: Readonly<{ children: React.ReactNode;}>) {
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <html lang="en">
      <body className={`min-h-screen ${
    darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  }`}>
        <Providers>
          <Navbar />
          {children}
          <ActivitySidebar />
        </Providers>
      </body>
    </html>
  );
}
