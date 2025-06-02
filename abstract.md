---

## 🔷 **Project Title: CryptoXplor – A MERN-Based Crypto Portfolio Dashboard with Wallet & Clerk Authentication**

### 🔍 **Abstract:**

**CryptoXplor** is a modern cryptocurrency portfolio dashboard developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). It bridges the gap between Web2 and Web3 by integrating traditional login systems (via Clerk) with decentralized wallet connections (via MetaMask). The platform empowers users to explore their crypto holdings, monitor real-time market data, simulate coin conversions, and calculate hypothetical profits or losses from virtual trades—all from a unified, user-friendly dashboard.

In addition to live market tracking and wallet integration, CryptoXplor includes a user-specific dashboard displaying profile information, conversion history, and a virtual trading module. This module allows users to simulate the purchase of cryptocurrencies at chosen prices and quantities, helping them estimate potential profit or loss without actual transactions.

This project is designed for crypto enthusiasts who want a simplified yet powerful way to track assets, interact with wallets, and experiment with trading strategies securely.

---

### 🧰 **Tech Stack:**

| Layer                  | Technologies Used                                                         |
| ---------------------- | ------------------------------------------------------------------------- |
| Frontend               | React.js, Tailwind CSS, Clerk Authentication                              |
| Backend                | Node.js, Express.js                                                       |
| Database               | MongoDB (Atlas or Local)                                                  |
| Authentication         | Clerk (email/password, OAuth), MetaMask (wallet connection via Ethers.js) |
| APIs                   | CoinGecko API (for live token data and price charts)                      |
| Blockchain Integration | Ethers.js (for retrieving wallet balances, token details)                 |

---

### 📦 **Modules & Features:**

1. **🔐 Authentication Module**

   * Clerk integration for email/password and social logins
   * MetaMask wallet connection via Ethers.js

2. **💼 Wallet Module**

   * Connect and display MetaMask wallet balances and token info
   * View ETH and ERC-20 token details

3. **📊 Dashboard Module**

   * Live prices, charts, and token history via CoinGecko API
   * Interactive graphs and historical data views

4. **🔁 Token Conversion Module**

   * Simulate token conversions using real-time exchange rates
   * View equivalent values and conversion logs

5. **📋 Virtual Trading & PnL Module** ✅ *(New)*

   * Place **virtual orders** with chosen coin, quantity, and price
   * Calculate potential **profit or loss** if the coin were bought at the specified price
   * No real transactions, ideal for simulation and learning

6. **🧑‍💼 User Dashboard Module** ✅ *(New)*

   * View profile info and connected wallet address
   * Access **conversion** and **virtual trade history**
   * Personal dashboard with secure, session-aware display

7. **🧩 UI/UX Module**

   * Responsive layout using Tailwind CSS
   * Light/Dark mode toggle (optional)
   * Graceful loading and error handling

---

### 🔄 **Workflow / User Flow:**

1. User logs in via **Clerk** or connects **MetaMask wallet**
2. Redirected to **Dashboard** showing:

   * Real-time crypto prices and charts
   * Connected wallet balance and token info
   * Profile overview and order history
3. User can:

   * Simulate **coin conversions**
   * Place **virtual orders** to estimate profit/loss
4. All history is securely stored and accessible in the personal dashboard

---

### ✅ **Why CryptoXplor?**

* Seamlessly merges Web2 & Web3 login experiences
* Helps users understand crypto assets through real-time simulation
* Interactive tools for testing trading strategies without financial risk
* Beginner-friendly interface with professional-grade data presentation
* Deployable via Vercel (frontend) and Render/Heroku (backend)

---