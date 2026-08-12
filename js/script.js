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

const backToTop = document.querySelector(".back-to-top");

backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const themeToggle = document.getElementById("theme-toggle");

themeToggle.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-theme") === "dark"));

const applyTheme = (next) => {
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.setAttribute("aria-pressed", String(next === "dark"));
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

themeToggle.addEventListener("click", (event) => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";

  if (!document.startViewTransition || prefersReducedMotion) {
    applyTheme(next);
    return;
  }

  const { clientX, clientY } = event;
  const radius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  );

  const transition = document.startViewTransition(() => applyTheme(next));

  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`] },
      { duration: 500, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
    );
  });
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

const spySections = ["about", "projects", "cooperation", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      document.querySelectorAll(`.nav-links a`).forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

spySections.forEach((section) => spyObserver.observe(section));

const expCount = document.getElementById("exp-count");
const expTarget = 5;

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);

      if (prefersReducedMotion) {
        expCount.textContent = String(expTarget);
        return;
      }

      let current = 0;
      const step = () => {
        current += 1;
        expCount.textContent = String(current);
        if (current < expTarget) requestAnimationFrame(() => setTimeout(step, 120));
      };
      step();
    });
  },
  { threshold: 0.5 }
);

countObserver.observe(document.querySelector(".experience-badge"));

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".project-thumb, .client-card, .contact-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}

const messageField = document.getElementById("message");

const autoGrow = () => {
  messageField.style.height = "auto";
  messageField.style.height = `${messageField.scrollHeight}px`;
};

messageField.addEventListener("input", autoGrow);
autoGrow();

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
