import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      style={{ background: "#0F1923" }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: 400,
          height: 400,
          background: "#00E5A0",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: 350,
          height: 350,
          background: "#FF5733",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-sans font-extrabold leading-none mb-2 select-none"
          style={{
            fontSize: "clamp(6rem, 20vw, 14rem)",
            color: "rgba(0,229,160,0.08)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          404
        </p>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginTop: "-2rem" }}
      >
        <h1
          className="font-sans font-extrabold mb-4 leading-tight"
          style={{ color: "#F5F0E8", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          This node doesn't exist.
        </h1>

        <p
          className="font-sans mb-10 max-w-md mx-auto leading-relaxed"
          style={{ color: "rgba(245,240,232,0.55)", fontSize: "1.05rem" }}
        >
          Looks like this automation hit a dead end. The page you're looking for
          was never built, got deleted, or the URL is wrong.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <motion.span
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="font-sans font-bold px-8 py-4 rounded-lg text-base cursor-pointer inline-block transition-all"
              style={{
                background: "#00E5A0",
                color: "#0F1923",
                boxShadow: "3px 3px 0px rgba(0,229,160,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform =
                  "translate(2px,2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "3px 3px 0px rgba(0,229,160,0.3)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              Back to Home
            </motion.span>
          </Link>
          <Link href="/guides">
            <motion.span
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="font-sans font-bold px-8 py-4 rounded-lg text-base cursor-pointer inline-block transition-all"
              style={{
                background: "transparent",
                color: "#F5F0E8",
                border: "2px solid rgba(245,240,232,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,240,232,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(245,240,232,0.2)";
              }}
            >
              Browse Guides
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
