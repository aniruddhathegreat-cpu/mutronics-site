import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="µtronics logo" className="h-14 w-auto object-contain" />
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">µtronics</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Product Range</Link>
          <Link to="/info" className="hover:underline">Info</Link>
          <Link to="/orders" className="hover:underline">Order Queries</Link>
          <Link to="/about" className="hover:underline">About Instruments</Link>
          <Link to="/about-us" className="hover:underline">About Us</Link>
          <Link to="/kb" className="hover:underline">Knowledge Base</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
