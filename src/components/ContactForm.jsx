import React, { useState, useEffect, useRef } from "react";

const RECAPTCHA_SITE_KEY = "6LfQjgwsAAAAAEdurayKaqfWOnaXdVEyBMAqO3ay";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7iN9XUCp_n0EssDRj2UpZrcx8UHSCliZM3_dR2UE9o_UNluO07rC5xetXiaK7d6umWA/exec";

const MIN_SUBMIT_TIME_MS = 1200;

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const formStart = useRef(Date.now());

  // Load reCAPTCHA v3
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setStatus(null);

    // Minimum human-time
    if (Date.now() - formStart.current < MIN_SUBMIT_TIME_MS) {
      setStatus({ type: "error", text: "Submission too fast." });
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

    // reCAPTCHA v3 token
    let recaptchaToken = "";
    try {
      recaptchaToken = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY,
        { action: "submit" }
      );
    } catch (err) {
      setStatus({ type: "error", text: "reCAPTCHA failed." });
      setSending(false);
      return;
    }

    // **** CRITICAL PART: SEND JSON ONLY ****
    const payload = {
      data: JSON.stringify({
        name,
        email,
        message,
        honeypot,
        recaptchaToken,
        submittedAt: Date.now()
      })
    };

    try {
      const resp = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"   // << NO FORM-DATA
        },
        body: JSON.stringify(payload)          // << JSON ONLY
      });

      const text = await resp.text();
      console.log("Raw server output:", text);

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        setStatus({ type: "error", text: "Invalid server response." });
        setSending(false);
        return;
      }

      if (json.success) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        form.reset();
        formStart.current = Date.now();
      } else {
        setStatus({ type: "error", text: json.error });
      }
    } catch (err) {
      console.error("Network error:", err);
      setStatus({ type: "error", text: "Network error — try again." });
    }

    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" rows="5" placeholder="Message" required />

      {/* Hidden honeypot field */}
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
        <p style={{ color: status.type === "error" ? "red" : "green" }}>
          {status.text}
        </p>
      )}
    </form>
  );
}
