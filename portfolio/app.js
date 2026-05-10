(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const setBtnState = (loading, text) => {
    if (!submitBtn) return;
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.textContent = text || "Preparing...";
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = text || "Send (copy summary)";
    }
  };

  const buildSummary = (name, email, message) => {
    const lines = [
      "Hi Ritesh,",
      "",
      "My details:",
      `- Name: ${name}`,
      `- Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      "— Sent from your portfolio site"
    ];
    return lines.join("\n");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) return;

    setBtnState(true, "Copying...");
    const summary = buildSummary(name, email, message);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summary);
      } else {
        const ta = document.createElement("textarea");
        ta.value = summary;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      setBtnState(false);
      alert("Copied your message summary to clipboard.");
    } catch (err) {
      setBtnState(false);
      alert("Could not copy. Please select and copy the message manually.");
    }
  });
})();
