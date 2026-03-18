import { Link } from "wouter";

export default function ShippingGuide() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Hero Section */}
      <section className="py-14" style={{ background: "#F5F0E8" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/guides">
            <span
              className="font-sans text-sm hover:underline cursor-pointer mb-6 inline-block"
              style={{ color: "#0F1923" }}
            >
              ← Back to Guides
            </span>
          </Link>
          <h1
            className="font-sans text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ color: "#0F1923" }}
          >
            How to Ship
          </h1>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Introduction & Requirements */}
          <div className="space-y-6">
            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              A shipped project requires a few essential components to be
              considered complete. First, you need to have a working workflow.
              While you can be waiting on specific integrations, all other parts
              of the workflow should work correctly. Second, your project must
              be open sourced in a public GitHub repository. Third, you must
              provide a link to a Lapse video showing you working on the
              project. For your hours to be counted towards prizes, they need to
              have been recorded on Lapse.
            </p>

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              Shipping is a pretty easy process. Start by opening your workflow
              and navigating to the three-dot menu, then press download.
            </p>

            <img
              src="/guide-images/shipping/image2.png"
              alt="n8n workflow download menu"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              Once you have downloaded the workflow, you will have a JSON file
              saved to your computer. The next step is to go to GitHub to create
              a new repository. Make sure that your repository visibility is set
              to public.
            </p>

            <img
              src="/guide-images/shipping/image1.png"
              alt="GitHub create new repository screen"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              While a README file is not required for your submission, it is
              recommended. A good README explains to anyone who finds your
              repository exactly what the project is and how it functions.
            </p>

            <img
              src="/guide-images/shipping/image3.png"
              alt="GitHub repository preview with README"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              After your repository is set up and your Lapse videos are ready,
              you are ready to submit. All that you have to do is fill out the
              submission form so that it can be reviewed.
            </p>
          </div>

          {/* Submission CTA */}
          <div className="rounded-2xl p-8" style={{ background: "#0F1923" }}>
            <h2
              className="font-sans text-2xl font-extrabold mb-4"
              style={{ color: "#00E5A0" }}
            >
              Ready to Ship?
            </h2>
            <p
              className="font-sans text-base leading-relaxed mb-6"
              style={{ color: "#F5F0E8" }}
            >
              Make sure you have your public GitHub link and your Lapse video
              URL ready before going to the form.
            </p>
            <a
              href="https://forms.fillout.com/t/3SiyMc86xGus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105"
              style={{
                background: "#00E5A0",
                color: "#0F1923",
                textDecoration: "none",
              }}
            >
              Open Submission Form
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
