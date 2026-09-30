const CONTACT_EMAIL = "donaldkimeli14@gmail.com";

document.documentElement.classList.add("js");

// Mobile menu
const menuToggle = document.querySelector("#menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

function setMenu(open) {
  mobileMenu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
window.addEventListener("resize", () => { if (window.innerWidth >= 768) setMenu(false); });

// Highlight the nav link for the section in view
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...document.querySelectorAll("main section[id]")];

function updateActiveLink() {
  const line = window.scrollY + window.innerHeight * 0.35;
  let current = sections[0].id;
  for (const section of sections) {
    if (section.offsetTop <= line) current = section.id;
  }
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    current = sections[sections.length - 1].id;
  }
  navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();

// Reveal project cards as they scroll into view, staggered
const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  revealItems.forEach((item, i) => item.style.setProperty("--reveal-delay", `${(i % 2) * 0.15}s`));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Skills: GIS style layer switcher
const layerTabs = [...document.querySelectorAll(".toc-item")];
const layerPanels = [...document.querySelectorAll(".layer-panel")];
let activeLayer = 0;
let swipeTimer;

layerPanels.forEach((panel, i) => panel.classList.toggle("is-active", i === 0));

function showLayer(index) {
  if (index === activeLayer) return;
  const prev = layerPanels[activeLayer];
  const next = layerPanels[index];

  layerTabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  layerPanels.forEach((panel) => panel.classList.remove("is-leaving", "is-entering"));
  prev.classList.remove("is-active");
  prev.classList.add("is-leaving");
  next.classList.add("is-active");
  void next.offsetWidth; // restart the swipe animation
  next.classList.add("is-entering");

  clearTimeout(swipeTimer);
  swipeTimer = setTimeout(() => {
    prev.classList.remove("is-leaving");
    next.classList.remove("is-entering");
  }, 950);

  activeLayer = index;
  layerTabs[index].scrollIntoView({ block: "nearest", inline: "nearest" });
}

layerTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => showLayer(i));
  tab.addEventListener("keydown", (event) => {
    const last = layerTabs.length - 1;
    const moves = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const target = (moves[event.key] + layerTabs.length) % layerTabs.length;
    showLayer(target);
    layerTabs[target].focus();
  });
});

// Map frames with a bounding box show the cursor position as lat/long
function formatCoord(value, pos, neg) {
  return `${Math.abs(value).toFixed(4)}°${value < 0 ? neg : pos}`;
}

document.querySelectorAll(".map-frame[data-bbox]").forEach((frame) => {
  const [north, south, west, east] = frame.dataset.bbox.split(",").map(Number);
  const readout = frame.querySelector(".map-readout");
  const show = (x, y) => {
    const lat = north + (south - north) * y;
    const lon = west + (east - west) * x;
    readout.textContent = `${formatCoord(lat, "N", "S")}  ${formatCoord(lon, "E", "W")}`;
  };
  show(0.5, 0.5);
  frame.addEventListener("pointermove", (event) => {
    const box = frame.getBoundingClientRect();
    show((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
  });
  frame.addEventListener("pointerleave", () => show(0.5, 0.5));
});

// Contact form: opens the visitor's email app with the message filled in
const form = document.querySelector("#contact-form");
const formError = document.querySelector("#form-error");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { name, email, subject, message } = form.elements;
  const required = [name, email, message];
  required.forEach((field) => field.setAttribute("aria-invalid", String(!field.checkValidity() || !field.value.trim())));

  const invalid = required.find((field) => field.getAttribute("aria-invalid") === "true");
  formError.hidden = !invalid;
  if (invalid) {
    invalid.focus();
    return;
  }

  const mailSubject = subject.value.trim() || `Portfolio enquiry from ${name.value.trim()}`;
  const body = `${message.value.trim()}\n\n${name.value.trim()}\n${email.value.trim()}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
});
