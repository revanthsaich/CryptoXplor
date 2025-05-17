import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Menu, X, Telescope } from "lucide-react"
import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useTheme } from "./theme-provider"
import { dark } from "@clerk/themes"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Docs", href: "/docs" },
    { name: "Dashboard", href: "/dashboard" },
  ]

  const handleNavigation = (e, item) => {
    e.preventDefault()

    if (item.name === "Features") {
      if (location.pathname !== "/") {
        navigate("/")
        setTimeout(() => {
          const section = document.getElementById("features")
          section?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        const section = document.getElementById("features")
        section?.scrollIntoView({ behavior: "smooth" })
      }
    } else if (item.name === "Home") {
      if (location.pathname !== "/") {
        navigate("/")
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    } else {
      navigate(item.href)
    }

    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center space-x-2">
            <Telescope className="h-10 w-10 text-blue-600" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              CryptoXplor
            </span>
          </Link>

          {/* Nav Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Theme & Auth */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignedIn>
              <UserButton
                key={theme}
                afterSignOutUrl="/"
                appearance={{
                  baseTheme: theme === "light" ? undefined : dark,
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="hidden sm:flex hover:bg-primary hover:text-primary-foreground"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-2 pb-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item)}
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {item.name}
                </a>
              ))}
              <SignedOut>
                <div className="px-4">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground">
                      Sign In
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
