// src/components/ContactForm.jsx
import React, { useState, useEffect, useRef } from "react";

// -------------------------------------------------------------
// CONFIG — UPDATE THESE:
// -------------------------------------------------------------
const RECAPTCHA_SITE_KEY = "6LfQjgwsAAAAAEdurayKaqfWOnaXdVEyBMAqO3ay";
const APPS_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwyd3Pq8fNJ53zXxINbEfbQTUXfJkrteNUFuSP9eTtGUfVSO-B5jHLDgoLsEHCV1KIt/exec";
// -------------------------------------------------------------

const SPAM_KEYWORDS = ["viagra", "casino", "loan", "bitcoin", "porn"];
const MIN_SUBMIT_TIME_MS = 1200;

// Dynamically load reCAPTCHA if needed
function loadRecaptcha(siteKey) {
  return new Promise((resolve) => {
    if (window.grecaptcha) return resolve(window.grecaptcha);

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve(window.grecaptcha);
    document.head.appendChild(script);
  });
}

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  // IMPORTANT: formStart must persist even if React Router remounts component
  const formStart = useRef(Date.now());

  useEffect(() => {
    loadRecaptcha(RECAPTCHA_SITE_KEY);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = (form.website.value || "").trim();

    // -------------------------
    // Client-side spam filtering
    // -------------------------
    if (!name || !email || !message) {
      setStatus({ type: "error", text: "Please complete all fields." });
      setSending(false);
      return;
    }

    if (honeypot !== "") {
      setStatus({ type: "spam", text: "Spam blocked (honeypot)." });
      setSending(false);
      return;
    }

    const now = Date.now();
    if (now - formStart.current < MIN_SUBMIT_TIME_MS) {
      setStatus({ type: "spam", text: "Submission too fast — blocked." });
      setSending(false);
      return;
    }

    const combined = (name + email + message).toLowerCase();
    if (SPAM_KEYWORDS.some((w) => combined.includes(w))) {
      setStatus({ type: "spam", text: "Spam-like content detected." });
      setSending(false);
      return;
    }

    // -------------------------
    // reCAPTCHA v3 token (SAFELY LOADED)
    // -------------------------
    let recaptchaToken = "";
    try {
      const recaptcha = await loadRecaptcha(RECAPTCHA_SITE_KEY);
      recaptchaToken = await recaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "submit",
      });
    } catch (err) {
      console.error("reCAPTCHA error:", err);
      setStatus({
        type: "error",
        text: "reCAPTCHA failed — please retry.",
      });
      setSending(false);
      return;
    }

    // -------------------------
    // Prepare the payload
    // -------------------------
    const payload = {
      name,
      email,
      message,
      submittedAt: now,
      honeypot,
      recaptchaToken,
    };

    console.log("Payload →", payload);

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    console.log("FormData keys →", [...formData.keys()]);

    // -------------------------
    // Send to Google Apps Script
    // -------------------------
    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const text = await resp.text();
      console.log("Raw response →", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        setStatus({
          type: "error",
          text: "Server returned non-JSON response.",
        });
        setSending(false);
        return;
      }

      if (json.success) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        form.reset();
        formStart.current = Date.now();
      } else {
        setStatus({
          type: "error",
          text: json.error || "Server rejected submission.",
        });
      }
    } catch (error) {
      console.error("Network error:", error);
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
        {/* Honeypot field */}
        <input type="text" name="website" className="hidden" tabIndex="-1" />

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
          />
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
