import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    return (
        <div className={cn("flex items-center gap-1 p-0.5 rounded-full border border-white/20 bg-white/10 opacity-60 hover:opacity-100 transition-all duration-300", className)}>
            {/* Light Mode */}
            <button
                onClick={() => setTheme("light")}
                className={cn(
                    "relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none",
                    theme === "light"
                        ? "text-primary shadow-sm"
                        : "text-white/70 hover:text-white"
                )}
            >
                {theme === "light" && (
                    <div className="absolute inset-0 bg-white rounded-full shadow-sm animate-in zoom-in-50 duration-200" />
                )}
                <Sun className="w-3.5 h-3.5 z-10 relative" />
                <span className="sr-only">Light</span>
            </button>

            {/* Dark Mode */}
            <button
                onClick={() => setTheme("dark")}
                className={cn(
                    "relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 focus:outline-none",
                    theme === "dark"
                        ? "text-primary shadow-sm"
                        : "text-white/70 hover:text-white"
                )}
            >
                {theme === "dark" && (
                    <div className="absolute inset-0 bg-white rounded-full shadow-sm animate-in zoom-in-50 duration-200" />
                )}
                <Moon className="w-3.5 h-3.5 z-10 relative" />
                <span className="sr-only">Dark</span>
            </button>

        </div>
    );
}
