import {
  Wallet2,
  BarChart2,
  Globe,
  Lock,
  RefreshCcw,
  BarChart4,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"

const features = [
  {
    title: "Track Wallets",
    description: "Monitor your wallets across multiple chains with real-time balance updates.",
    icon: Wallet2,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    points: [
      "Multi-chain wallet tracking",
      "Live balance updates",
      "Custom wallet labels",
    ],
  },
  {
    title: "Token Analytics",
    description: "View detailed stats for all your tokens including price history and allocation.",
    icon: BarChart2,
    iconColor: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/20",
    points: [
      "Real-time price tracking",
      "Historical charts",
      "Portfolio distribution",
    ],
  },
  {
    title: "Multi-Chain Support",
    description: "Explore assets across Ethereum, BNB, Polygon, and more—all in one place.",
    icon: Globe,
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    points: [
      "Ethereum, BNB, Polygon, etc.",
      "Unified dashboard",
      "Cross-chain insights",
    ],
  },
  {
    title: "Secure & Private",
    description: "We don’t store private keys. Your data is safe and encrypted.",
    icon: Lock,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    points: [
      "No key storage",
      "End-to-end encryption",
      "Privacy-first design",
    ],
  },
  {
    title: "Auto Portfolio Sync",
    description: "Automatic updates to your portfolio with latest market data.",
    icon: RefreshCcw,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    points: [
      "Live sync with blockchain",
      "Token metadata refresh",
      "Zero manual refresh",
    ],
  },
  {
    title: "Performance Metrics",
    description: "Get a deep look at your portfolio’s growth and performance over time.",
    icon: BarChart4,
    iconColor: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    points: [
      "Portfolio ROI charts",
      "Historical value tracking",
      "Growth breakdown",
    ],
  },
]

export function Features() {
  return (
    <section id="features" className="bg-background text-foreground py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-base font-semibold text-indigo-500">
            Powerful Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for your crypto portfolio
          </p>
          <p className="mt-6 text-lg text-muted-foreground">
            CryptoXplor is built to help you manage assets across chains,
            analyze token performance, and secure your Web3 experience—all in one place.
          </p>
        </div>

        <div className="mt-20 grid max-w-2xl mx-auto grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-none">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border bg-background shadow-sm hover:shadow-md transition"
              >
                <CardHeader>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 text-sm text-muted-foreground space-y-1">
                    {feature.points.map((point, i) => (
                      <li key={i}>• {point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
