import { Link } from "react-router-dom";
import { Code2, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-2.5 font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-card">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">CodeSense</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AI Powered Java Learning Platform — helping students understand code better.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/analyzer", label: "Code Analyzer" },
                { to: "/compiler", label: "Compiler" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">About</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              CodeSense helps students analyze, compile, and understand Java programs using AI-assisted explanations.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© 2026 CodeSense. All rights reserved.</span>
          <span className="inline-flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-destructive" /> for students
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
