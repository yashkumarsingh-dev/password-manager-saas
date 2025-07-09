import { Button } from "../components/ui/button";
import PricingSectionCards from "../components/cards";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col dark overflow-x-hidden relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-violet-900/40 via-transparent to-indigo-900/30 animate-gradient-fade" />
      </div>

      {/* Header */}
      <header className="w-full py-4 flex items-center justify-between border-b border-border bg-[hsl(var(--card))] text-[hsl(var(--foreground))] sticky top-0 z-10 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">🔒 Password Manager</span>
        </div>
        <nav className="flex gap-4">
          <a href="/login" className="text-sm font-medium hover:underline">
            Log In
          </a>
          <a href="/register">
            <Button className="font-semibold transition-all duration-200 hover:scale-105">
              Get Started Free
            </Button>
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center w-full py-20 gap-12 flex-1 z-10 fade-in px-8 md:px-24">
        <div className="flex-1 w-full max-w-2xl py-8 px-8 md:px-12 bg-[hsl(var(--card))]/80 rounded-2xl shadow-2xl border border-border animate-fade-in flex flex-col justify-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary leading-tight text-center md:text-left max-w-lg w-full mx-auto md:mx-0">
            The most trusted{" "}
            <span className="text-violet-400">password manager</span>
          </h1>
          <p className="text-lg text-muted-foreground text-center md:text-left max-w-lg w-full mx-auto md:mx-0">
            Securely store, manage, and share your passwords and sensitive
            information with confidence. Protect your digital life with modern
            encryption and 2FA.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="/register">
              <Button
                size="lg"
                className="text-base font-semibold transition-all duration-200 hover:scale-105">
                Get Started Free
              </Button>
            </a>
            <a href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold border-primary text-primary transition-all duration-200 hover:scale-105">
                Log In
              </Button>
            </a>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="secondary"
                className="text-base font-semibold transition-all duration-200 hover:scale-105">
                Pricing
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-violet-900/40 text-violet-300 px-3 py-1 rounded-full text-xs font-medium">
              Open Source
            </span>
            <span className="bg-violet-900/40 text-violet-300 px-3 py-1 rounded-full text-xs font-medium">
              End-to-End Encryption
            </span>
            <span className="bg-violet-900/40 text-violet-300 px-3 py-1 rounded-full text-xs font-medium">
              2FA Security
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <img
            src="/assets/app-screenshot.png"
            alt="App screenshot"
            className="rounded-xl shadow-2xl border border-border w-full h-full object-cover bg-black animate-fade-in"
            style={{ maxWidth: 420, maxHeight: 340 }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10 fade-in">
        <div className="bg-[hsla(var(--card),0.6)] backdrop-blur-md rounded-xl p-8 border border-[rgba(255,255,255,0.15)] shadow-md flex flex-col items-center text-center transition-all duration-200 hover:shadow-xl hover:scale-105">
          <span className="text-4xl mb-3">🔐</span>
          <h3 className="font-bold text-xl mb-2 text-primary">
            Strong Encryption
          </h3>
          <p className="text-muted-foreground text-base">
            Your data is protected with industry-leading encryption and
            zero-knowledge architecture.
          </p>
        </div>
        <div className="bg-[hsla(var(--card),0.6)] backdrop-blur-md rounded-xl p-8 border border-[rgba(255,255,255,0.15)] shadow-md flex flex-col items-center text-center transition-all duration-200 hover:shadow-xl hover:scale-105">
          <span className="text-4xl mb-3">📱</span>
          <h3 className="font-bold text-xl mb-2 text-primary">
            2FA & Security
          </h3>
          <p className="text-muted-foreground text-base">
            Enable two-factor authentication for an extra layer of security on
            your account.
          </p>
        </div>
        <div className="bg-[hsla(var(--card),0.6)] backdrop-blur-md rounded-xl p-8 border border-[rgba(255,255,255,0.15)] shadow-md flex flex-col items-center text-center transition-all duration-200 hover:shadow-xl hover:scale-105">
          <span className="text-4xl mb-3">💡</span>
          <h3 className="font-bold text-xl mb-2 text-primary">Easy to Use</h3>
          <p className="text-muted-foreground text-base">
            A beautiful, modern interface with dark mode and seamless experience
            across devices.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-muted-foreground py-6 border-t border-border mt-auto bg-[hsl(var(--card))]/80 z-10">
        &copy; {new Date().getFullYear()} Password Manager. All rights reserved.
      </footer>

      {/* Animations */}
      <style>{`
        .fade-in { animation: fadeIn 1.2s ease; }
        .animate-fade-in { animation: fadeIn 1.2s ease; }
        .animate-gradient-fade { animation: gradientFade 8s ease-in-out infinite alternate; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes gradientFade {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
