// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salomonkoita — Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics.",
  description: "Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics. — Powered by Solo IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        {children}
      </body>
    </html>
  );
}
