/* Clark Suan — Portfolio interactions */
(() => {
  "use strict";

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

  /* --- contact form → Formspree --- */
  const form = document.getElementById("contactForm");
  if (form) {
    const status = form.querySelector(".form__status");
    const btn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.style.color = "#f87171";
        status.textContent = "Please fill in all fields with a valid email.";
        return;
      }

      // Not configured yet — fall back to a friendly demo confirmation.
      if (form.action.includes("YOUR_FORM_ID")) {
        const name = form.elements.name.value.trim().split(" ")[0] || "there";
        status.style.color = "#facc15";
        status.textContent = `Demo mode, ${name}: add your Formspree ID in index.html to send for real.`;
        form.reset();
        return;
      }

      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status.style.color = "";
      status.textContent = "";

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const name = form.elements.name.value.trim().split(" ")[0] || "there";
          status.style.color = "";
          status.textContent = `Thanks, ${name} — your message is on its way. I'll be in touch soon.`;
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.errors?.[0]?.message || "Request failed");
        }
      } catch (err) {
        status.style.color = "#f87171";
        status.textContent = "Something went wrong — please email admin@getfudogroup.com directly.";
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
    const cards = [...document.querySelectorAll(".work[data-model], .cs[data-model]")];
    const worksGrid = document.querySelector(".works");
    const casesSec = document.getElementById("case-studies");
    const empty = document.querySelector(".works__empty");

    const apply = (filter) => {
      let shown = 0;
      cards.forEach((c) => {
        const match = filter === "all" || c.dataset.model === filter;
        c.hidden = !match;
        if (match) shown += 1;
      });
      if (worksGrid) worksGrid.hidden = !worksGrid.querySelector(".work[data-model]:not([hidden])");
      if (casesSec) casesSec.hidden = !casesSec.querySelector(".cs[data-model]:not([hidden])");
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
