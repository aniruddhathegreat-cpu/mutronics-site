import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Info from "./pages/Info";
import Orders from "./pages/Orders";
import About from "./pages/About";
import KnowledgeBase from "./pages/KnowledgeBase";
import AboutUs from "./pages/AboutUs";
import ContactForm from "./components/ContactForm";

export default function App() {
  const [contactStatus, setContactStatus] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/info" element={<Info />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/kb" element={<KnowledgeBase />} />
          <Route
            path="/contact"
            element={
              <ContactForm
                onSubmit={() =>
                  setContactStatus({
                    type: "success",
                    message: "Thanks! We received your message.",
                  })
                }
              />
            }
          />
        </Routes>

        {contactStatus && (
          <div
            className={`mt-6 p-4 rounded-md ${
              contactStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {contactStatus.message}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
