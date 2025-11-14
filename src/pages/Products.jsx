import React from "react";

export default function Products() {
  const sampleProducts = [
    {
      id: 1,
      name: "µScope — Precision Digitizer",
      summary: "16-bit sampling, low-noise front-end, USB/ethernet.",
    },
    {
      id: 2,
      name: "µTone — Analog Processor",
      summary: "High-headroom analog path with digital control.",
    },
    {
      id: 3,
      name: "µPack — Modular IO",
      summary: "Flexible IO modules for custom rigs.",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold">Product Range</h2>
      <p className="mt-2 text-gray-600">
        Browse our core instruments — each unit is bench-tested and documented.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {sampleProducts.map((p) => (
          <article key={p.id} className="border rounded-lg p-4">
            <div className="h-36 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              Image
            </div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{p.summary}</p>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 text-sm border rounded">Details</button>
              <button className="px-3 py-2 text-sm bg-gray-900 text-white rounded">
                Order
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
