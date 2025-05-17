import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === "light";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-9 w-9 rounded-md transition-colors ${
        isLight
          ? "bg-white text-black hover:bg-gray-100"
          : "bg-gray-800 text-white hover:bg-gray-700"
      }`}
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] transition-transform duration-200 ${
          isLight ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-transform duration-200 ${
          isLight ? "scale-0 rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 