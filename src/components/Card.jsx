import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="p-5 border rounded-lg">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}
