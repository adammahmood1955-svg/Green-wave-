// Paste your deployed Google Apps Script Web App URL below.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2bINa53wFiXpU2RWi2WvirPcV_At2ZAQklutwkmDaMfmTaH2zk4pUzmqwQSbBZHIL/exec";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("communityForm");
const submitBtn = document.getElementById("submitBtn");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    status.textContent = "The website connection has not been configured yet. Please contact the GREEN WAVE team.";
    status.style.color = "#a33";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.source = "GREEN WAVE Website";
  data.submittedAt = new Date().toISOString();

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  status.textContent = "Sending your information...";
  status.style.color = "#52675c";

  try {
    // Apps Script accepts a text/plain POST without a browser CORS preflight.
    // no-cors means the browser cannot read Google's response; the page therefore
    // reports that the request was sent, not that the spreadsheet row was verified.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });
    status.textContent = "Your submission has been sent. Thank you for supporting a cleaner Jalingo! If the team needs more details, GREEN WAVE may contact you.";
    status.style.color = "#08783e";
    form.reset();
  } catch (error) {
    status.textContent = "We could not send your submission. Please check your internet connection and try again, or contact GREEN WAVE by phone.";
    status.style.color = "#a33";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit information";
  }
});
