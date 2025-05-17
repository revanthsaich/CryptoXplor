import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

export function Documentation() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight font-serif">
            CryptoXplor – A MERN-Based Crypto Portfolio Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
            Track, simulate, and explore your crypto assets with MetaMask & Clerk integration
          </p>
        </div>

        {/* Abstract */}
        <div className="prose prose-gray dark:prose-invert max-w-none font-sans">
          <p className="text-lg">
            <strong>CryptoXplor</strong> is a modern cryptocurrency portfolio dashboard developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It bridges the gap between Web2 and Web3 by integrating traditional login systems (via Clerk) with decentralized wallet connections (via MetaMask). The platform empowers users to explore their crypto holdings, monitor real-time market data, view token history, and simulate coin conversions—all from a unified, user-friendly dashboard.
          </p>
          <p className="text-lg">
            This project is designed for crypto enthusiasts who want a simplified way to track their assets, access live price data, and interact with Web3 wallets in a secure and efficient environment.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif">Tech Stack</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground font-sans">
                <li><strong>Frontend:</strong> React.js, Tailwind CSS, Clerk Authentication</li>
                <li><strong>Backend:</strong> Node.js, Express.js</li>
                <li><strong>Database:</strong> MongoDB (Atlas or Local)</li>
                <li><strong>Authentication:</strong> Clerk (email/password, OAuth), MetaMask via Ethers.js</li>
                <li><strong>APIs:</strong> CoinGecko API (for live token data and charts)</li>
                <li><strong>Blockchain:</strong> Ethers.js (wallet balances and token info)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif">Modules & Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🔐 Authentication Module</CardTitle>
                <CardDescription className="font-sans">
                  Login using Clerk (email, Google, GitHub) or authenticate via MetaMask wallet.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">💼 Wallet Module</CardTitle>
                <CardDescription className="font-sans">
                  Connect MetaMask, display ETH and ERC-20 balances, and token metadata.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">📊 Dashboard Module</CardTitle>
                <CardDescription className="font-sans">
                  View real-time crypto prices, charts, and interactive graphs using CoinGecko data.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🔁 Token Conversion Module</CardTitle>
                <CardDescription className="font-sans">
                  Simulate conversions like ETH → USDT with live rates and logs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🕒 History & Logging Module</CardTitle>
                <CardDescription className="font-sans">
                  Track simulated conversions and optionally store activity in MongoDB.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🧩 UI/UX Module</CardTitle>
                <CardDescription className="font-sans">
                  Clean Tailwind UI, responsive layout, dark/light mode, loading states, and error handling.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Workflow */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif">Workflow / User Flow</h2>
          <Card>
            <CardContent className="pt-6">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground font-sans">
                <li>User logs in using Clerk or connects their MetaMask wallet.</li>
                <li>On authentication, they're redirected to the dashboard.</li>
                <li>Dashboard displays wallet info, live prices, charts, and token data.</li>
                <li>User can simulate coin conversions using live rates from CoinGecko.</li>
                <li>Conversion logs are optionally stored and viewable in the History module.</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Why CryptoXplor */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-serif">Why CryptoXplor?</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground font-sans">
                <li>Seamlessly combines Web2 (Clerk) and Web3 (MetaMask) authentication</li>
                <li>Real-time crypto data powered by CoinGecko</li>
                <li>Simplified portfolio tracking with beautiful Tailwind UI</li>
                <li>Ideal for learners and enthusiasts experimenting with wallets and tokens</li>
                <li>Easy deployment on Vercel (frontend) and Render/Heroku (backend)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
