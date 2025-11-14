import React from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Precision electronics, crafted for measurement and creativity
          </h2>
          <p className="mt-4 text-gray-600">
            µtronics creates bespoke analog and digital instruments for engineers, researchers, and sound designers. Elegant design — rigorous performance.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/products")}
              className="px-5 py-3 rounded-md shadow-sm bg-gray-900 text-white text-sm"
            >
              Explore products
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-5 py-3 rounded-md border text-sm"
            >
              Contact sales
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold">Featured instrument</h3>
          <div className="mt-4 h-56 flex items-center justify-center border rounded-md bg-white">
            <div className="text-center text-gray-500">
              Product photo / carousel placeholder
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Card title="Quality & Specs">
          Hand-built PCBs, calibrated outputs, long-term stability.
        </Card>
        <Card title="Support & Orders">
          Direct order queries, expedited shipping, and warranty.
        </Card>
        <Card title="Research & Custom">
          Custom engineering and small-run manufacturing for labs and studios.
        </Card>
      </div>
    </section>
  );
}
