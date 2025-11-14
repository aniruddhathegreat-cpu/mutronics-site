import React from "react";

export default function Orders() {
  return (
    <section>
      <h2 className="text-2xl font-bold">Order Queries</h2>
      <p className="mt-2 text-gray-600">
        If you have questions about an existing order, shipping, or custom
        quotes, reach out via the contact form or email{" "}
        <a
          href="mailto:sales@mutronics.example"
          className="text-gray-800 underline"
        >
          sales@mutronics.example
        </a>
        .
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold">Track your order</h4>
          <p className="text-sm text-gray-600 mt-2">
            Provide your order ID and we'll update you with ETA and tracking
            number.
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold">Custom quotes</h4>
          <p className="text-sm text-gray-600 mt-2">
            Need a custom instrument or integration? Describe your requirements
            and we'll provide a quote.
          </p>
        </div>
      </div>
    </section>
  );
}
