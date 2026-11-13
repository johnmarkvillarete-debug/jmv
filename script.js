"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const EMAIL = "johnmarkvillarete@gmail.com";

/* Greeting based on the visitor's local time */
function setGreeting() {
  const h = new Date().getHours();
  const text = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = text + ", and welcome to my portfolio.";
}

/* Mobile menu */
function setupMenu() {
  const btn = $("#menu"), list = $("#navlist");
  const toggle = (open) => {
    list.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
  };
  btn.addEventListener("click", () => toggle(!list.classList.contains("open")));
  list.addEventListener("click", (e) => { if (e.target.tagName === "A") toggle(false); });
}

/* Light and dark theme, remembered between visits */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) {}
}
function setupTheme() {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  if (saved) applyTheme(saved);
  $("#theme").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(isDark ? "light" : "dark");
  });
}

/* Filter projects and certificates */
function filterItems(type) {
  $$(".item").forEach((item) => {
    item.hidden = !(type === "all" || item.dataset.t === type);
  });
}
function setupFilter() {
  const buttons = $$(".filters button");
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn));
    filterItems(btn.dataset.f);
  }));
}

/* Highlight the current section in the navigation */
function setupActiveNav() {
  const links = $$("nav a");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section").forEach((s) => observer.observe(s));
}

/* Back to top button */
function setupBackToTop() {
  const btn = $("#toTop");
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Copy email to clipboard */
function setupCopyEmail() {
  const btn = $("#copyEmail");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      btn.textContent = "Copied!";
    } catch (e) {
      btn.textContent = "Copy failed";
    }
    setTimeout(() => { btn.textContent = "Copy"; }, 1800);
  });
}

/* Footer year */
function setYear() { $("#yr").textContent = new Date().getFullYear(); }

document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  setupMenu();
  setupTheme();
  setupFilter();
  setupActiveNav();
  setupBackToTop();
  setupCopyEmail();
  setYear();
});