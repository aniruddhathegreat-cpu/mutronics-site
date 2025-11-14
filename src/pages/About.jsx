import React from "react";

export default function About() {
  return (
    <section>
      <h2 className="text-2xl font-bold">About the Instruments</h2>
      <p className="mt-3 text-gray-600">
        Our instruments combine careful analog design with modern digital
        controls. We document calibration procedures, test data and firmware
        release notes so engineers can integrate confidently.
      </p>

      <div className="mt-6 space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold">Design principles</h4>
          <p className="text-sm text-gray-600 mt-2">
            Low-noise, reproducible measurements, and serviceability are core to
            our design process.
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold">Manufacturing</h4>
          <p className="text-sm text-gray-600 mt-2">
            Small-run manufacturing with thorough QA and burn-in tests for every
            unit.
          </p>
        </div>
      </div>
    </section>
  );
}
