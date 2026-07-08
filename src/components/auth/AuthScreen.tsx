import { SignIn } from "@clerk/clerk-react";

export function AuthScreen() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Vault</span>
        </div>

        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold text-white leading-snug">
              "The secure data room our M&amp;A team needed — simple, fast, and reliable."
            </p>
            <footer className="text-white/70 text-sm">
              — Due Diligence Team
            </footer>
          </blockquote>
        </div>

        <div className="space-y-4">
          {[
            { icon: "🔒", text: "End-to-end secure document storage" },
            { icon: "📁", text: "Nested folders with unlimited depth" },
            { icon: "🔍", text: "Instant search across all documents" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-white/80 text-sm">
              <span className="text-base">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Clerk sign-in */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Vault</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your data rooms</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-input bg-background hover:bg-accent text-foreground text-sm font-medium h-9 rounded-md",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-xs",
                formFieldLabel: "text-sm font-medium text-foreground",
                formFieldInput:
                  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md text-sm font-medium w-full",
                footerActionLink: "text-primary hover:text-primary/80 font-medium",
                identityPreviewEditButton: "text-primary",
                formFieldErrorText: "text-destructive text-xs",
                alertText: "text-destructive text-sm",
                alertIcon: "text-destructive",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
