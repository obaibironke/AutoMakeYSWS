import { useState } from "react";
import { Link, useLocation } from "wouter";

const RSVP_URL = "https://forms.fillout.com/t/aMV1bXZoGvus";
const HACK_CLUB_AUTH_URL =
  "https://auth.hackclub.com/oauth/authorize?client_id=c89f85642fe94c65cbead982b0b7e9b8&redirect_uri=http://automake.dino.icu/auth&response_type=code&scope=profile%20email%20name%20slack_id%20verification_status";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  if (location.startsWith("/dashboard") || location.startsWith("/shop")) return null;

  const isSignedIn = !!sessionStorage.getItem("slack_id");

  const handleDashboard = () => {
    if (isSignedIn) {
      setLocation("/dashboard");
    } else {
      window.location.href = HACK_CLUB_AUTH_URL;
    }
  };

  const links = [
    { label: "Showcase", href: "/showcase" },
    { label: "Guides", href: "/guides" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ background: "#0F1923" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <span
              className="font-sans text-2xl font-extrabold tracking-tight cursor-pointer"
              style={{ color: "#00E5A0" }}
            >
              Automake
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="font-sans text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: location === link.href ? "#00E5A0" : "#F5F0E8",
                    borderBottom:
                      location === link.href ? "2px solid #00E5A0" : "none",
                    paddingBottom: location === link.href ? "2px" : undefined,
                  }}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            <button
              onClick={handleDashboard}
              className="font-sans text-sm font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
              style={{
                color: location === "/dashboard" ? "#00E5A0" : "#F5F0E8",
                borderBottom:
                  location === "/dashboard" ? "2px solid #00E5A0" : "none",
                paddingBottom: location === "/dashboard" ? "2px" : undefined,
              }}
            >
              Dashboard
            </button>

            <a href={RSVP_URL} target="_blank" rel="noopener noreferrer">
              <span
                className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer transition-all inline-block"
                style={{
                  background: "#00E5A0",
                  color: "#0F1923",
                  boxShadow: "2px 2px 0px #F5F0E8",
                }}
              >
                RSVP
              </span>
            </a>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-transform duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ background: "#F5F0E8" }}
            />
            <span
              className={`block w-6 h-0.5 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
              style={{ background: "#F5F0E8" }}
            />
            <span
              className={`block w-6 h-0.5 transition-transform duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ background: "#F5F0E8" }}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-4"
          style={{
            background: "#0F1923",
            borderTop: "1px solid rgba(245,240,232,0.1)",
          }}
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className="font-sans text-base font-medium cursor-pointer"
                style={{ color: "#F5F0E8" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}

          <button
            onClick={() => {
              setMenuOpen(false);
              handleDashboard();
            }}
            className="font-sans text-base font-medium cursor-pointer bg-transparent border-none p-0 text-left"
            style={{ color: "#F5F0E8" }}
          >
            Dashboard
          </button>


            href={RSVP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            <span
              className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer inline-block text-center"
              style={{ background: "#00E5A0", color: "#0F1923" }}
            >
              RSVP
            </span>
          </a>
        </div>
      )}
    </nav>
  );
}