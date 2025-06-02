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
            CryptoXplor – A MERN-Based Crypto Portfolio Dashboard with Wallet & Clerk Authentication
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-sans">
            Explore real-time crypto data, track wallet balances, and simulate token conversions—all secured by Clerk and MetaMask.
          </p>
        </div>

        {/* Abstract */}
        <div className="prose prose-gray dark:prose-invert max-w-none font-sans">
          <p className="text-lg">
            <strong>CryptoXplor</strong> is a full-stack cryptocurrency dashboard built on the MERN stack (MongoDB, Express.js, React.js, Node.js), designed for tracking and simulating digital asset transactions in a user-friendly and responsive interface.
          </p>
          <p className="text-lg">
            It features dual authentication—Clerk (email/OAuth) and MetaMask wallet login—offering seamless Web2 and Web3 access. Users can connect their Ethereum wallets, fetch live ETH and ERC-20 token balances, simulate coin conversions using real-time rates via CoinGecko, and log their activity securely in a personal dashboard.
          </p>
          <p className="text-lg">
            With conversion history tracking, interactive charts, and a responsive UI powered by Tailwind, CryptoXplor offers crypto enthusiasts a unified platform to manage, visualize, and explore their portfolio.
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
                <li><strong>APIs:</strong> CoinGecko API (live prices, charts, and conversion rates)</li>
                <li><strong>Blockchain:</strong> Ethers.js (wallet and token data)</li>
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
                  Secure login via Clerk or decentralized wallet login via MetaMask.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">💼 Wallet Module</CardTitle>
                <CardDescription className="font-sans">
                  Connect Ethereum wallets, display wallet address, ETH, and token balances using Ethers.js.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">📊 Dashboard Module</CardTitle>
                <CardDescription className="font-sans">
                  Visualize live crypto prices and historical charts using CoinGecko and Chart.js/Recharts.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🔁 Token Conversion Module</CardTitle>
                <CardDescription className="font-sans">
                  Simulate real-time token conversions with exchange rates and auto-conversion logging.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🕒 History & Logging Module</CardTitle>
                <CardDescription className="font-sans">
                  View past simulated conversions and wallet interactions, with optional MongoDB storage.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-xl">🧩 UI/UX Module</CardTitle>
                <CardDescription className="font-sans">
                  Clean, dark/light themed UI with Tailwind, animations, loading states, and error handling.
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
                <li>User lands on the homepage and chooses to log in using Clerk or connect MetaMask.</li>
                <li>Upon authentication, they are redirected to the dashboard.</li>
                <li>The dashboard displays wallet details, token balances, and live charts.</li>
                <li>User can simulate token conversions, which are processed with real-time data.</li>
                <li>All interactions are logged under the History tab and optionally saved to MongoDB.</li>
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
                <li>Unified Web2 and Web3 login system for convenience and flexibility</li>
                <li>Live market data and conversion rates using CoinGecko API</li>
                <li>Clean and responsive UI built with Tailwind CSS</li>
                <li>Conversion simulations and historical tracking for learning and analysis</li>
                <li>Ideal for developers, crypto enthusiasts, and learners entering the blockchain space</li>
                <li>Easy deployment on platforms like Vercel and Render/Heroku</li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
