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
            Automake Shipping Guide
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
              considered complete. First, you must have a working workflow;
              while you can be waiting on specific integrations, all other parts
              of the logic should function correctly[cite: 1]. Additionally,
              your project must be hosted in a public GitHub repository[cite:
              2]. Finally, you must provide a link to a Lapse video showing you
              working on the project. Please note that if the work was not
              recorded on Lapse, it will not be counted[cite: 3].
            </p>

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              Shipping is a straightforward process. Start by opening your
              workflow and navigating to the three-dot menu, then simply press
              download[cite: 4].
            </p>

            <img
              src="/public/guide-images/shipping/workflow-download.png"
              alt="n8n workflow download menu"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              Once you have downloaded the workflow, you will have a JSON file
              saved to your computer[cite: 5]. The next step is to head over to
              GitHub to create a new repository. Ensure that you set the
              visibility of this repository to public[cite: 6].
            </p>

            <img
              src="/public/guide-images/shipping/github-new-repo.png"
              alt="GitHub create new repository screen"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              While a README file is not strictly necessary for your submission,
              it is strongly recommended. A good README explains to anyone who
              finds your repository exactly what the project is and how it
              functions[cite: 7].
            </p>

            <img
              src="/public/guide-images/shipping/github-repo-preview.png"
              alt="GitHub repository preview with README"
              className="rounded-lg w-full"
              style={{ border: "2px solid #0F1923" }}
            />

            <p
              className="font-sans text-lg leading-relaxed"
              style={{ color: "#0F1923" }}
            >
              After your repository is set up and your Lapse videos are ready,
              you are prepared to submit[cite: 8]. All that remains is to fill
              out the submission form to finalize your project[cite: 9].
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
              URL ready before heading to the form.
            </p>
            <button
              className="px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105"
              style={{ background: "#00E5A0", color: "#0F1923" }}
            >
              Open Submission Form
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
