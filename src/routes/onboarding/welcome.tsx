import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, BarChart3, Building2, Zap, Shield } from "lucide-react"

export const Route = createFileRoute("/onboarding/welcome")({
  component: Welcome,
})

function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      {/* Lignes pointillées horizontales */}
      <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-border -translate-y-1/2" />
      <div className="absolute top-0 left-1/2 right-0 h-px border-t border-dashed border-border" />
      <div className="absolute bottom-0 left-1/2 right-0 h-px border-t border-dashed border-border" />

      {/* Lignes pointillées verticales */}
      <div className="absolute top-0 left-1/3 bottom-0 w-px border-l border-dashed border-border" />
      <div className="absolute top-0 left-2/3 bottom-0 w-px border-l border-dashed border-border" />

      {/* Box centrale avec bordures */}
      <div className="relative z-10 w-full max-w-2xl bg-background border p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 bg-background flex items-center justify-center border border-border">
            <Building2 className="w-10 h-10 text-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Welcome to Wareflow
          </h1>
          <p className="text-xl text-muted-foreground">
            Transform your warehouse data into actionable insights in minutes
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-0 mb-12 border-x border-y">
          {[
            { icon: BarChart3, title: "Import Excel", desc: "From any WMS system" },
            { icon: Zap, title: "Fast Analysis", desc: "Get insights in minutes" },
            { icon: Shield, title: "100% Private", desc: "Local data only" },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-6 bg-background border-r border-b last:border-r-0 hover:bg-accent/50 transition-colors"
              >
                <Icon className="w-6 h-6 mb-3 text-primary" />
                <h3 className="font-semibold mb-1 text-sm">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            to="/onboarding/warehouse"
            className="group inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded hover:bg-primary/90 transition-colors"
          >
            Let's Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Skip option */}
        <div className="text-center mt-8">
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
          >
            I'll explore first →
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-2 h-2 bg-primary" />
          <div className="w-2 h-2 bg-muted" />
          <div className="w-2 h-2 bg-muted" />
        </div>
      </div>
    </div>
  )
}
