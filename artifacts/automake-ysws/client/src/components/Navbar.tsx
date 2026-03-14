import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { label: "Showcase", href: "/showcase" },
    { label: "Guides", href: "/guides" },
    { label: "Shop", href: "/shop" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#D1DCCF] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="font-serif text-2xl font-bold text-[#3B2F3E] tracking-tight cursor-pointer">
              Automake
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
                    location === link.href
                      ? "text-[#3B2F3E] border-b-2 border-[#3B2F3E] pb-0.5"
                      : "text-[#424242] hover:text-[#3B2F3E]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/guides">
              <span className="font-sans text-sm font-semibold bg-[#3B2F3E] text-white px-5 py-2 rounded-lg hover:bg-[#2d2330] transition-colors cursor-pointer">
                Get Started
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[#3B2F3E] transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#3B2F3E] transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[#3B2F3E] transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#D1DCCF] px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className="font-sans text-base font-medium text-[#424242] hover:text-[#3B2F3E] cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/guides">
            <span
              className="font-sans text-sm font-semibold bg-[#3B2F3E] text-white px-5 py-2 rounded-lg hover:bg-[#2d2330] transition-colors cursor-pointer inline-block text-center"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
