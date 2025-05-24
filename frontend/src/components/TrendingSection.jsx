import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp } from "lucide-react"
import { ArrowRight } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"
import { Button } from "./ui/button"

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
}

const coins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
]

export default function TrendingSection() {
  const navigate = useNavigate()
  const [data, setData] = useState({})

  useEffect(() => {
    async function fetchData() {
      const result = {}
      try {
        await Promise.all(
          coins.map(async (coin) => {
            try {
              const response = await fetch(
                `http://localhost:5000/market/market-chart/${coin.id}?vs_currency=usd&days=7`
              )
              if (!response.ok) {
                throw new Error(`Failed to fetch ${coin.id} data`)
              }
              const json = await response.json()
              // Format the data for the chart
              result[coin.id] = json.prices.map(item => ({
                day: new Date(item[0]).toLocaleDateString("en-US", { weekday: "short" }),
                price: parseFloat(item[1].toFixed(2))
              }))
            } catch (err) {
              console.error(`Failed to fetch ${coin.id} data:`, err)
              // Set empty array as fallback
              result[coin.id] = []
            }
          })
        )
        setData(result)
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="py-24 sm:py-32 bg-background text-foreground" id="trending">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trending Coins
            </h2>
            <p className="mt-2 text-muted-foreground text-lg">
              Explore what's moving in the crypto market
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2
            border bg-primary border-primary text-primary-foreground
            hover:bg-primary-foreground 
            dark:border-primary 
            dark:hover:bg-primary-foreground
            transition-colors duration-200" onClick={() => navigate("/trending")}>
            See All
            <ArrowRight/>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coins.map((coin) => (
            <Card key={coin.id}>
              <CardHeader>
                <CardTitle>{coin.name}</CardTitle>
                <CardDescription>Last 7 Days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data[coin.id] || []}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis hide domain={["auto", "auto"]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5, stroke: '#60a5fa', strokeWidth: 3, fill: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Trending up this week <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground">
                  {coin.symbol.toUpperCase()} live from CoinGecko
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
