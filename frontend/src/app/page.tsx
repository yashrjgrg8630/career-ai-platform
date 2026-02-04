"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, BarChart3, FileText, Target } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <span className="text-gray-900">CareerAI</span>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all hover:shadow-md"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 mb-8 hover:border-gray-300 hover:bg-gray-100 transition-all">
          <BarChart3 className="h-4 w-4" />
          <span>AI-Powered Career Management</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl text-gray-900 mb-6">
          Manage Your Job Search Like a Professional
        </h1>

        <p className="max-w-2xl text-lg text-gray-600 mb-10">
          Track applications, analyze resumes, and get data-driven insights to accelerate your career growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 bg-gray-900 px-8 py-3.5 rounded-md text-white font-semibold hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Start for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white px-8 py-3.5 rounded-md text-gray-900 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-md"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 border-t border-gray-100">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="h-6 w-6 text-gray-700" />}
            title="Resume Analysis"
            description="Upload your PDF and get detailed insights on ATS compatibility and skill gaps."
          />
          <FeatureCard
            icon={<Target className="h-6 w-6 text-gray-700" />}
            title="Application Tracking"
            description="Visualize your pipeline with a clean Kanban board from applied to offer."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-gray-700" />}
            title="Analytics Dashboard"
            description="Track response rates, interview conversion, and optimize your strategy."
          />
        </div>
      </section>

      <footer className="mt-auto border-t border-gray-100 py-12 text-center text-sm text-gray-500">
        <p>© 2026 CareerAI Platform. Professional career management tools.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg hover:scale-105 cursor-pointer">
      <div className="mb-4 rounded-lg bg-gray-50 p-3 w-fit border border-gray-200 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
