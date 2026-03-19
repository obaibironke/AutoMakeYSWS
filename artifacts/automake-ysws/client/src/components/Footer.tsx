import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "#0F1923", color: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <span
              className="font-sans text-2xl font-extrabold"
              style={{ color: "#00E5A0" }}
            >
              Automake
            </span>
            <p
              className="mt-3 font-sans text-sm leading-relaxed"
              style={{ color: "rgba(245,240,232,0.7)" }}
            >
              A global program for teen builders who want to create real
              automation projects and earn rewards.
            </p>
          </div>

          <div>
            <h4
              className="font-sans font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "#F5F0E8" }}
            >
              Program
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Showcase", href: "/showcase" },
                { label: "Guides", href: "/guides" },
                {
                  label: "Github Repository",
                  href: "https://github.com/obaibironke/AutoMakeYSWS"
                },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span
                      className="font-sans text-sm cursor-pointer transition-colors"
                      style={{ color: "rgba(245,240,232,0.7)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#00E5A0")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "rgba(245,240,232,0.7)")
                      }
                    >
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-sans font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "#F5F0E8" }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/#faq" },
                { label: "About", href: "/#about" },
                { label: "Starter Guides", href: "/guides" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>
                    <span
                      className="font-sans text-sm cursor-pointer transition-colors"
                      style={{ color: "rgba(245,240,232,0.7)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#00E5A0")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "rgba(245,240,232,0.7)")
                      }
                    >
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-sans font-semibold text-sm uppercase tracking-wider mb-4"
              style={{ color: "#F5F0E8" }}
            >
              Community
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Discord", href: "#" },
                { label: "GitHub", href: "#" },
                { label: "Twitter / X", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="font-sans text-sm transition-colors"
                    style={{ color: "rgba(245,240,232,0.7)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#00E5A0")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "rgba(245,240,232,0.7)")
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(245,240,232,0.1)" }}
        >
          <p
            className="font-sans text-sm"
            style={{ color: "rgba(245,240,232,0.7)" }}
          >
            A program for teen builders. Open to ages 13–18 worldwide.
          </p>
          <p
            className="font-sans text-xs"
            style={{ color: "rgba(245,240,232,0.4)" }}
          >
            © {new Date().getFullYear()} Automake YSWS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
