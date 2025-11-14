// src/components/ContactForm.jsx
import React, { useState, useEffect } from "react";

// -------------------------------------------------------------
// CONFIG — UPDATE THESE:
// -------------------------------------------------------------
const RECAPTCHA_SITE_KEY = "6LfQjgwsAAAAAEdurayKaqfWOnaXdVEyBMAqO3ay";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRAY98f1PXQPuniPHkgNhkKBL9AssxdIX_ASI0aVgf7bOSGzyzPBVhpQAGw6GJlGRf/exec";
// -------------------------------------------------------------

const SPAM_KEYWORDS = ["viagra", "casino", "loan", "bitcoin", "porn"];
const MIN_SUBMIT_TIME_MS = 1200; // minimum human time

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [formStart] = useState(() => Date.now());

  // Make sure reCAPTCHA is available
  useEffect(() => {
    if (!window.grecaptcha) {
      console.warn("reCAPTCHA script not loaded. Check index.html head section.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = (form.website.value || "").trim(); // hidden field

    // -------------------------
    // Client-side spam filtering
    // -------------------------

    // Required fields
    if (!name || !email || !message) {
      setStatus({ type: "error", text: "Please complete all fields." });
      setSending(false);
      return;
    }

    // Honeypot check
    if (honeypot !== "") {
      setStatus({ type: "spam", text: "Spam blocked (honeypot)." });
      setSending(false);
      return;
    }

    // Too fast (bot-like)
    const now = Date.now();
    if (now - formStart < MIN_SUBMIT_TIME_MS) {
      setStatus({ type: "spam", text: "Submission too fast — blocked." });
      setSending(false);
      return;
    }

    // Keyword filter
    const combined = (name + email + message).toLowerCase();
    if (SPAM_KEYWORDS.some((w) => combined.includes(w))) {
      setStatus({ type: "spam", text: "Spam-like content detected." });
      setSending(false);
      return;
    }

    // reCAPTCHA v3
    let recaptchaToken = "";
    try {
      recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "submit",
      });
    } catch (err) {
      setStatus({ type: "error", text: "reCAPTCHA failed. Try again." });
      setSending(false);
      return;
    }

    // Prepare payload
    const payload = {
      name,
      email,
      message,
      submittedAt: now,
      recaptchaToken,
      honeypot,
    };

    // Send to Apps Script backend
    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      const json = await resp.json();

      if (json.success) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        form.reset();
      } else {
        setStatus({
          type: "error",
          text: json.error || "Server rejected the submission.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", text: "Network error — try again." });
    }

    setSending(false);
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Contact Us</h2>
      <p className="mt-2 text-gray-600">
        For sales, support or technical inquiries, send a message below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid md:grid-cols-2 gap-4"
        noValidate
      >
        {/* Honeypot field (hidden) */}
        <input
          type="text"
          name="website"
          className="hidden"
          autoComplete="off"
          tabIndex="-1"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" className="w-full border rounded-md p-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            rows={6}
            className="w-full border rounded-md p-2"
            required
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-gray-900 text-white rounded-md"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </div>

        {status && (
          <div
            className={`mt-4 md:col-span-2 ${
              status.type === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {status.text}
          </div>
        )}
      </form>
    </section>
  );
}
