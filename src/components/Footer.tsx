import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-3 flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg tracking-tight">CodeSense</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI Powered Java Learning Platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/analyzer", label: "Code Analyzer" },
                { to: "/compiler", label: "Compiler" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">About</h4>
            <p className="text-sm text-muted-foreground">
              CodeSense helps students analyze, compile, and understand Java programs using AI-assisted explanations.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2026 CodeSense. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
