"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
   <button
  onClick={() =>
    setTheme(theme === "dark" ? "light" : "dark")
  }
  className="rounded-lg border border-gray-300 p-2 bg-white text-black hover:bg-red-500 dark:bg-gray-900 dark:text-white dark:hover:bg-green-500"
>
  {theme === "dark" ? <Sun /> : <Moon />}
</button>
  );
}