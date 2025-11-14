import React from "react";

export default function AboutUs() {
  return (
    <section className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">About Us</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6 items-start">
        <div className="bg-gray-100 h-48 md:h-60 rounded-md flex items-center justify-center text-gray-500">
          Photo Placeholder
        </div>
        <div className="md:col-span-2 text-gray-700 leading-relaxed">
          <p>
            Aniruddha is a Master’s student at the Massachusetts Institute of
            Technology and associated with NECSTLab, MIT. He completed his
            Bachelor of Technology in Electronics and Communication Engineering
            at the Indian Institute of Technology Guwahati, India.
          </p>
          <p className="mt-3">
            He worked as a Research Intern in the DCS Lab at Hanyang University,
            South Korea during the pre-final year of his undergraduate study. He
            is interested in electrodynamics, nanoelectronics, and communication
            engineering.
          </p>
        </div>
      </div>
    </section>
  );
}
