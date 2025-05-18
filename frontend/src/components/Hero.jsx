import { Button } from "./ui/button"
import { ArrowRight, BarChart2, Wallet2, Globe } from "lucide-react"
import { Link } from "react-router-dom"
import React from "react"

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-4 sm:pb-28 lg:px-8 lg:py-24">
        {/* Main Text Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-foreground py-2 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
            Explore Your Crypto Universe in One Dashboard
          </h1>
          <p className="mt-6 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
            CryptoXplor helps you monitor wallet balances, track token prices, and manage your portfolio across multiple blockchains—all in real time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-muted transition active:translate-y-0.5 active:shadow-inner active:scale-[0.98] transform duration-75"
            >
              <Link to="/dashboard" className="font-bold flex items-center gap-2">
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              asChild
              className="border-border hover:bg-muted transition hover:border-black active:translate-y-0.5 active:shadow-inner active:scale-[0.98] transform duration-75"
            >
              <Link to="/docs" className="font-bold">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-16 max-w-5xl lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                <Wallet2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Track Wallets</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Monitor your wallets across multiple chains with real-time balance updates.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/20">
                <BarChart2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Token Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View detailed stats for all your tokens including price history and allocation.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Multi-Chain Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore assets across Ethereum, BNB, Polygon, and more—all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
