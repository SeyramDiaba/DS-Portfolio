const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

const closeNav = () => {
  navLinks.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
};

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

document.addEventListener("click", (event) => {
  if (
    navLinks.classList.contains("open") &&
    !navLinks.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    closeNav();
  }
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

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitBtn = contactForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  formStatus.className = "form-status";
  formStatus.textContent = "Sending…";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    contactForm.classList.add("is-sent");
    formStatus.className = "form-status success";
    formStatus.textContent = "Message sent, I'll get back to you soon.";
  } catch (err) {
    formStatus.className = "form-status error";
    formStatus.innerHTML =
      'Something went wrong. Please email me directly at <a href="mailto:diabaseyram@gmail.com">diabaseyram@gmail.com</a>.';
    submitBtn.disabled = false;
  }
});
