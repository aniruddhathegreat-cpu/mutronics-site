import React, { useState, useEffect, useRef } from "react";

// -------------------------------------------------------------
// CONFIG — UPDATE THESE:
// -------------------------------------------------------------
const RECAPTCHA_SITE_KEY = "6LfQjgwsAAAAAEdurayKaqfWOnaXdVEyBMAqO3ay";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7iN9XUCp_n0EssDRj2UpZrcx8UHSCliZM3_dR2UE9o_UNluO07rC5xetXiaK7d6umWA/exec";
// -------------------------------------------------------------

const MIN_SUBMIT_TIME_MS = 1200;

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const formStart = useRef(Date.now());

  // Load reCAPTCHA
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Helper: submit form
  async function handleSubmit(e) {
    e.preventDefault();

    if (sending) return;

    setSending(true);
    setStatus(null);

    const now = Date.now();
    if (now - formStart.current < MIN_SUBMIT_TIME_MS) {
      setStatus({ type: "error", text: "Submission too fast — try again." });
      setSending(false);
      return;
    }

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const honeypot = form.honeypot.value.trim();

    if (!name || !email || !message) {
      setStatus({ type: "error", text: "All fields are required." });
      setSending(false);
      return;
    }

    if (honeypot !== "") {
      setStatus({ type: "error", text: "Bot detected." });
      setSending(false);
      return;
    }

    let recaptchaToken = "";

    try {
      recaptchaToken = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "submit" }
      );
    } catch (err) {
      console.error("reCAPTCHA error:", err);
      setStatus({ type: "error", text: "reCAPTCHA failed. Try again." });
      setSending(false);
      return;
    }

    const payload = {
      data: JSON.stringify({
        name,
        email,
        message,
        honeypot,
        recaptchaToken,
        submittedAt: Date.now(),
      }),
    };

    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      console.log("Raw server response:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        setStatus({
          type: "error",
          text: "Server returned invalid response.",
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
    } catch (err) {
      console.error("Network error:", err);
      setStatus({ type: "error", text: "Network error — try again." });
    }

    setSending(false);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Your Name" required />

      <input name="email" type="email" placeholder="Your Email" required />

      <textarea name="message" rows="5" placeholder="Your Message" required />

      {/* Invisible honeypot field */}
      <input
        name="honeypot"
        type="text"
        style={{ display: "none" }}
        tabIndex="-1"
        autoComplete="off"
      />

      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </button>

      {status && (
        <p
          style={{
            marginTop: "10px",
            color: status.type === "error" ? "red" : "green",
          }}
        >
          {status.text}
        </p>
      )}
    </form>
  );
}
