const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

const themeToggle = document.getElementById("theme-toggle");

themeToggle.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-theme") === "dark"));

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.setAttribute("aria-pressed", String(next === "dark"));
});

const siteHeader = document.querySelector(".site-header");

const updateHeaderScrolled = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 4);
};

updateHeaderScrolled();
window.addEventListener("scroll", updateHeaderScrolled, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
