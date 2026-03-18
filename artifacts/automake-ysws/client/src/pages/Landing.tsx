// client/src/pages/Landing.tsx
import React from "react";

const Landing: React.FC = () => {
  return (
    <main className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to AutoMakeYSWS
        </h1>
        <p className="text-xl max-w-xl mb-8">
          Streamline your workflows and automate repetitive tasks easily.
        </p>
        <a
          href="#get-started"
          className="px-6 py-3 bg-cyan-500 text-gray-900 font-semibold rounded-lg hover:bg-cyan-400 transition"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Fast Setup</h2>
            <p>Get started in minutes with zero configuration required.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Flexible Workflows</h2>
            <p>Customizable automation pipelines for any project type.</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4">Secure & Reliable</h2>
            <p>Enterprise-grade security ensures your data is protected.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="mb-4">
              “This tool saved our team hours every week. Highly recommend!”
            </p>
            <span className="font-semibold">- Alex T.</span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="mb-4">
              “Intuitive, fast, and reliable. Exactly what we needed.”
            </p>
            <span className="font-semibold">- Samira K.</span>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="mb-4">
              “The automation features are incredibly powerful and easy to use.”
            </p>
            <span className="font-semibold">- Jordan L.</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="get-started"
        className="py-20 px-6 bg-cyan-500 text-gray-900 text-center"
      >
        <h2 className="text-4xl font-bold mb-6">Ready to automate?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Start building your automated workflows today, no experience required.
        </p>
        <a
          href="/signup"
          className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up Now
        </a>
      </section>
    </main>
  );
};

export default Landing;