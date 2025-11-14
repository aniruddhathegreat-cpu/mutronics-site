import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-6xl mx-auto p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} µtronics — The Digitizer
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/kb" className="hover:underline">Knowledge Base</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <a href="#" className="text-gray-500 hover:underline">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
