import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#3B2F3E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-serif text-2xl font-bold text-white">Automake</span>
            <p className="mt-3 font-sans text-sm text-[#D1DCCF] leading-relaxed">
              A global program for teen builders who want to create real automation projects and earn rewards.
            </p>
          </div>

          {/* Program */}
          <div>
            <h4 className="font-sans font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Program
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Showcase", href: "/showcase" },
                { label: "Guides", href: "/guides" },
                { label: "Shop", href: "/shop" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span className="font-sans text-sm text-[#D1DCCF] hover:text-white transition-colors cursor-pointer">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-sans font-semibold text-white text-sm uppercase tracking-wider mb-4">
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
                    <span className="font-sans text-sm text-[#D1DCCF] hover:text-white transition-colors cursor-pointer">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-sans font-semibold text-white text-sm uppercase tracking-wider mb-4">
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
                    className="font-sans text-sm text-[#D1DCCF] hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-[#D1DCCF]">
            A program for teen builders. Open to ages 13–18 worldwide.
          </p>
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} Automake YSWS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
