// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "#6366f1" }} />
            <span className="font-bold text-xl">Salomonkoita</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">Home</Link>
            <Link href="/crm" className="text-sm font-medium hover:text-primary">CRM</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Welcome to 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Salomonkoita
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
              style={{ backgroundColor: "#6366f1" }}>Get Started</Link>
            <Link href="/about" className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-medium border hover:bg-accent transition-colors">Learn More</Link>
          </div>
          
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-semibold text-lg mb-2">Lead Management</h3>
                <p className="text-muted-foreground">AI-scored leads with automated follow-ups</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-semibold text-lg mb-2">Deal Pipeline</h3>
                <p className="text-muted-foreground">Visual pipeline with win probability predictions</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-lg mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">Real-time dashboards with AI insights</p>
              </div>
            </div>
        </section>
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Salomonkoita. Built with Solo IA.</p>
      </footer>
    </div>
  );
}
