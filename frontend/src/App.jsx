import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react"
import toast, { Toaster } from "react-hot-toast"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Features } from "./components/Features"
import { Documentation } from "./pages/Documentation"
import { Dashboard } from './components/Dashboard'
import { useEffect } from "react"
import TrendingSection from "./components/TrendingSection"
const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error('Please sign in to access this page');
      navigate('/', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return null;
  }

  return isSignedIn ? children : null;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="codeflow-theme">
      <Router>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="w-full min-h-[calc(100vh-4rem)]">
                    <Hero />
                    <Features />
                    <TrendingSection />
                  </div>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

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

              <Route
                path="/docs"
                element={
                  <div className="w-full min-h-[calc(100vh-4rem)] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Documentation />
                  </div>
                }
              />



              <Route
                path="*"
                element={
                  <Navigate to="/" replace />
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
