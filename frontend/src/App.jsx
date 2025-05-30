import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
  } from "react-router-dom";
  import React from "react";
  import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
  import toast, { Toaster } from "react-hot-toast";
  import { ThemeProvider } from "./components/theme-provider";
  import { Navbar } from "./components/Navbar";
  import { Hero } from "./components/Hero";
  import { Features } from "./components/Features";
  import { Documentation } from "./pages/Documentation";
  import { Dashboard } from "./components/Dashboard";
  import TrendingSection from "./components/TrendingSection";
  import MarketSection from "./components/MarketSection";
  import { Provider } from "react-redux";
  import { PersistGate } from 'redux-persist/integration/react';
  import { store, persistor } from "./redux/store";
  import { OrderProvider } from "./contexts/OrderContext";
  import { useEffect } from "react";
  import CoinDetail from "./components/CoinDetail";
  import TrendingSidebar from "./components/TrendingSidebar";
  import CoinPage from "./components/CoinPage";
  // ─────────────────────────────
  // 🔐 ProtectedRoute Component
  // ─────────────────────────────
  const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        toast.error("Please sign in to access this page");
        navigate("/", { replace: true });
      }
    }, [isLoaded, isSignedIn, navigate]);
  
    if (!isLoaded) return null;
  
    return isSignedIn ? children : null;
  };
  
  // ─────────────────────────────
  // 💡 App Component
  // ─────────────────────────────
  function App() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider defaultTheme="system" storageKey="codeflow-theme">
            <OrderProvider>
              <Router>
                <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
                  <Navbar />
                  <main className="flex-1 w-full">
                    <Routes>
                      {/* Home */}
                      <Route
                        path="/"
                        element={
                          <div className="w-full min-h-[calc(100vh-4rem)]">
                            <Hero />
                            <Features />
                            <TrendingSection />
                            <MarketSection />
                          </div>
                        }
                      />

                      {/* Dashboard (Protected) */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/search"
                        element={
                          <ProtectedRoute>
                            <CoinPage />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/coin/:coinId"
                        element={
                          <ProtectedRoute>
                            <div className="flex h-screen">
                              <TrendingSidebar />
                              <div className="flex-1 p-4">
                                <CoinDetail />
                              </div>
                            </div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Features Page */}
                      <Route
                        path="/features"
                        element={
                          <div className="w-full min-h-[calc(100vh-4rem)]">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                              <h1 className="text-2xl font-bold">Features</h1>
                            </div>
                          </div>
                        }
                      />

                      {/* Docs Page */}
                      <Route
                        path="/documentation"
                        element={<Documentation />}
                      />

                      {/* Catch-all */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Toaster position="top-right" />
                </div>
              </Router>
            </OrderProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
  
  export default App;