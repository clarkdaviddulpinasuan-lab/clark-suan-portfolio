/* Clark Suan — Portfolio interactions */
(() => {
  "use strict";

  /* ▸ SETUP: fill these in — see CONTACT-SETUP.md */
  const CONTACT_CONFIG = {
    emailjs: {
      publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
      serviceId: "YOUR_EMAILJS_SERVICE_ID",
      ownerTemplateId: "YOUR_EMAILJS_OWNER_TEMPLATE_ID",
      autoreplyTemplateId: "YOUR_EMAILJS_AUTOREPLY_TEMPLATE_ID",
    },
    googleForm: {
      // e.g. "https://docs.google.com/forms/d/e/1FAIpQLS.../formResponse"
      actionUrl: "YOUR_GOOGLE_FORM_RESPONSE_URL",
      // entry.XXXXXXX ids from the Google Form's fields
      nameField: "YOUR_NAME_ENTRY_ID",
      emailField: "YOUR_EMAIL_ENTRY_ID",
      messageField: "YOUR_MESSAGE_ENTRY_ID",
    },
  };

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  /* --- sticky nav border on scroll --- */
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- mobile menu --- */
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* --- scroll reveal --- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* --- testimonials marquee: clone the row for a seamless loop --- */
  const marquee = document.querySelector(".marquee");
  if (marquee) {
    const track = marquee.querySelector(".marquee__track");
    const group = track && track.firstElementChild;
    if (group) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      marquee.classList.add("is-ready");
    }
  }

  /* --- case-study lightbox --- */
  const frames = document.querySelectorAll(".frame[data-full]");
  if (frames.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">✕</button>' +
      '<img alt="Full design preview" />' +
      '<span class="lightbox__hint">Click anywhere or press Esc to close</span>';
    document.body.appendChild(box);
    const boxImg = box.querySelector("img");

    const open = (src) => {
      boxImg.src = src;
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      box.classList.remove("open");
      document.body.style.overflow = "";
      boxImg.src = "";
    };

    frames.forEach((f) =>
      f.addEventListener("click", () => open(f.getAttribute("data-full")))
    );
    box.addEventListener("click", (e) => {
      if (e.target !== boxImg || e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("open")) close();
    });
  }

  /* --- contact form → EmailJS (both emails) + Google Form (spreadsheet log) --- */
  const form = document.getElementById("contactForm");
  if (form) {
    const status = form.querySelector(".form__status");
    const btn = form.querySelector("button[type=submit]");
    const cfg = CONTACT_CONFIG;
    const configured =
      window.emailjs &&
      !cfg.emailjs.publicKey.startsWith("YOUR_") &&
      !cfg.emailjs.serviceId.startsWith("YOUR_") &&
      !cfg.emailjs.ownerTemplateId.startsWith("YOUR_");

    if (configured) emailjs.init({ publicKey: cfg.emailjs.publicKey });

    // Fire-and-forget log to the linked Google Sheet via the Form's endpoint.
    // no-cors means we can't read the response, but the submission still lands.
    function logToSheet({ name, email, message }) {
      if (cfg.googleForm.actionUrl.startsWith("YOUR_")) return;
      const data = new FormData();
      data.append(cfg.googleForm.nameField, name);
      data.append(cfg.googleForm.emailField, email);
      data.append(cfg.googleForm.messageField, message);
      fetch(cfg.googleForm.actionUrl, { method: "POST", mode: "no-cors", body: data }).catch(() => {});
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.style.color = "#f87171";
        status.textContent = "Please fill in all fields with a valid email.";
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const message = form.elements.message.value.trim();

      if (!configured) {
        status.style.color = "#facc15";
        status.textContent = `Demo mode, ${name.split(" ")[0] || "there"}: add your EmailJS/Google Form IDs in script.js to send for real.`;
        return;
      }

      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status.style.color = "";
      status.textContent = "";

      logToSheet({ name, email, message });

      try {
        await emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.ownerTemplateId, {
          from_name: name,
          from_email: email,
          message,
        });

        if (!cfg.emailjs.autoreplyTemplateId.startsWith("YOUR_")) {
          await emailjs.send(cfg.emailjs.serviceId, cfg.emailjs.autoreplyTemplateId, {
            to_email: email,
            to_name: name,
            message,
          });
        }

        status.style.color = "";
        status.textContent = `Thanks, ${name.split(" ")[0] || "there"} — your message is on its way. I'll be in touch soon.`;
        form.reset();
      } catch (err) {
        status.style.color = "#f87171";
        status.textContent = "Something went wrong — please email clarklindleysuan@gmail.com directly.";
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  }

  /* --- works page: filter projects by business model --- */
  const filterBar = document.querySelector(".workfilter");
  if (filterBar) {
    const chips = [...filterBar.querySelectorAll(".workfilter__chip")];
    const cards = [...document.querySelectorAll("main [data-model]")];
    const worksGrid = document.querySelector(".works");
    const sections = [...document.querySelectorAll("main .section")];
    const empty = document.querySelector(".works__empty");

    const apply = (filter) => {
      let shown = 0;
      cards.forEach((c) => {
        const match = filter === "all" || c.dataset.model === filter;
        c.hidden = !match;
        if (match) shown += 1;
      });
      if (worksGrid) worksGrid.hidden = !worksGrid.querySelector("[data-model]:not([hidden])");
      sections.forEach((sec) => {
        if (sec.id === "works") return; // keeps the filter bar visible
        sec.hidden = !sec.querySelector("[data-model]:not([hidden])");
      });
      if (empty) empty.hidden = shown > 0;
      chips.forEach((ch) => {
        const on = ch.dataset.filter === filter;
        ch.classList.toggle("is-active", on);
        ch.setAttribute("aria-pressed", String(on));
      });
    };

    chips.forEach((ch) =>
      ch.addEventListener("click", () => {
        apply(ch.dataset.filter);
        const q = ch.dataset.filter === "all" ? location.pathname : `?filter=${ch.dataset.filter}`;
        history.replaceState(null, "", q);
      })
    );

    const initial = new URLSearchParams(location.search).get("filter");
    if (initial && chips.some((c) => c.dataset.filter === initial)) apply(initial);
  }
})();
