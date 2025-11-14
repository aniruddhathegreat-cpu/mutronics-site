import React from "react";

export default function KnowledgeBase() {
  const articles = [
    {
      id: 1,
      title: "Calibration guide for µScope",
      excerpt:
        "Step-by-step calibration procedures and test signals.",
    },
    {
      id: 2,
      title: "Firmware update process",
      excerpt:
        "How to update device firmware and restore factory settings.",
    },
    {
      id: 3,
      title: "Signal grounding best practices",
      excerpt:
        "Tips to reduce noise and measurement errors in sensitive setups.",
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold">Knowledge Base</h2>
      <p className="mt-2 text-gray-600">
        Technical articles, user manuals, and troubleshooting guides to help you
        get the most from your instrument.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{a.excerpt}</p>
            <div className="mt-4">
              <button className="text-sm underline text-gray-800">
                Read article
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
