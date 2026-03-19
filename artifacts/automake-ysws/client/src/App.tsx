import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Showcase from "./pages/Showcase";
import ProjectDetail from "./pages/ProjectDetail";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import ShippingGuide from "./pages/ShippingGuide";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";

function ManifestoPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "60vh",
        backgroundColor: "#FF5733",
        color: "#3B2F3E",
        zIndex: 10000,
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        borderBottom: "8px solid #3B2F3E",
        boxShadow: "0 10px 0 rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "900",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          Automake Manifesto
        </h1>
        <p
          style={{ fontSize: "1.25rem", lineHeight: "1.6", fontWeight: "600" }}
        >
          Automake was designed so that teens like you can learn how to use your
          ingenuity to solve real problems. While others seek to stifle
          creativity, I seek to enable it, to give it the proper tools and
          launchpad to grow and become something great. I believe that any teen
          can change the world, and I hope to prove that you can be the change.
        </p>
        <p style={{ marginTop: "20px", fontSize: "1.1rem", opacity: 0.9 }}>
          Let this discovery serve as a testament to your curiousity. The first
          person that finds this and reports to @Oba on Slack with proof will
          recieve a special reward.
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#3B2F3E",
            color: "#FFFFFF",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          CLOSE TERMINAL
        </button>
      </div>
    </motion.div>
  );
}

function Router() {
  const [showManifesto, setShowManifesto] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = (input + e.key).slice(-8);
      setInput(newInput);

      if (newInput.toLowerCase() === "automake") {
        setShowManifesto(true);
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  return (
    <div>
      <AnimatePresence>
        {showManifesto && (
          <ManifestoPanel onClose={() => setShowManifesto(false)} />
        )}
      </AnimatePresence>

      <a
        href="https://hackclub.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", top: "100px", left: "0px", zIndex: 9999 }}
      >
        <img
          src="https://assets.hackclub.com/flag-orpheus-left.svg"
          alt="Hack Club"
          style={{ width: "200px" }}
        />
      </a>
      <Navbar />
      <main>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/showcase" component={Showcase} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route path="/guides" component={Guides} />
          <Route path="/guides/:id" component={GuideDetail} />
          <Route path="/shop" component={Shop} />
          <Route path="/ship" component={ShippingGuide} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/auth" component={AuthCallback} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
