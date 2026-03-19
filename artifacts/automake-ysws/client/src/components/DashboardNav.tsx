import { Link, useLocation } from "wouter";

export default function DashboardNav() {
  const [location, setLocation] = useLocation();

  const links = [
    { label: "Showcase", href: "/showcase" },
    { label: "Guides", href: "/guides" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const handleSignOut = () => {
    sessionStorage.clear();
    setLocation("/");
  };

  const userName = sessionStorage.getItem("user_name") || "User";
  const credits = sessionStorage.getItem("credits") || "0";

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{
        background: "#0F1923",
        borderBottom: "1px solid rgba(0,229,160,0.15)",
      }}
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

            <Link href="/shop">
              <span
                className="font-sans text-sm font-bold px-5 py-2 rounded-lg cursor-pointer transition-all inline-block"
                style={{
                  background: "#FF5733",
                  color: "white",
                  boxShadow: "2px 2px 0px #F5F0E8",
                }}
              >
                Shop
              </span>
            </Link>

            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(0,229,160,0.1)",
                border: "1px solid rgba(0,229,160,0.3)",
              }}
            >
              <span
                className="font-sans text-xs font-bold"
                style={{ color: "#00E5A0" }}
              >
                {credits} credits
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="font-sans text-sm font-semibold"
                style={{ color: "#F5F0E8" }}
              >
                {userName.split(" ")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="font-sans text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: "rgba(255,87,51,0.15)",
                  color: "#FF5733",
                  border: "1px solid rgba(255,87,51,0.3)",
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
