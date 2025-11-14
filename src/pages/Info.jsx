import React from "react";

export default function Info() {
  return (
    <section>
      <h2 className="text-2xl font-bold">Information & Policies</h2>
      <div className="mt-4 text-gray-600 space-y-3">
        <p>
          <strong>Shipping:</strong> We ship worldwide from our workshop.
          Lead times depend on configuration.
        </p>
        <p>
          <strong>Warranty:</strong> Standard 1-year warranty. Extended plans
          available for critical systems.
        </p>
        <p>
          <strong>Returns:</strong> Please contact support within 14 days for
          return authorization.
        </p>
      </div>
    </section>
  );
}
