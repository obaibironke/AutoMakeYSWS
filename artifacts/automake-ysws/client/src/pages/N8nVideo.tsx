export default function N8nVideo() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#D1DCCF] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold text-[#3B2F3E] mb-4">
            n8n Workflow Execution
          </h1>
          <p className="font-sans text-lg text-[#424242] max-w-2xl mx-auto">
            Learn how to execute workflows with n8n automation
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <video
            controls
            className="w-full rounded-xl shadow-lg bg-black"
            style={{ aspectRatio: "16 / 9" }}
          >
            <source src="/N8N workflow execution.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="text-center font-sans text-[#424242] mt-6 text-lg">
            Watch the full workflow execution tutorial above
          </p>
        </div>
      </section>
    </div>
  );
}
