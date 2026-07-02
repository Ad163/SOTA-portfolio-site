/* ═══════════════════════════════════════════════════════════════════════
   SAVIOUR HENRY - SOTA Portfolio · Motion layer
   Lenis smooth scroll + GSAP/ScrollTrigger cinematic reveals.
   Defensive by design: content ALWAYS becomes visible even if a CDN
   fails to load or a library throws. Honours prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis === "function";
  var lenis = null;

  /* ───────── Safety net: never leave content hidden ─────────
     If the animation engine is missing or a script throws, show everything.
     IMPORTANT: this must NOT run when ScrollTrigger is healthy, or it would
     reveal every section up-front and kill the scroll animations. */
  function revealAll() {
    var els = document.querySelectorAll("[data-rv]");
    for (var i = 0; i < els.length; i++) els[i].classList.add("rv-in");
  }
  window.addEventListener("load", function () {
    if (reduce || !hasST) setTimeout(revealAll, 1200);
  });
  // Fail open only on a genuine script error.
  window.addEventListener("error", function () { setTimeout(revealAll, 200); });

  /* ───────── Preloader ───────── */
  function finishLoad() {
    document.body.classList.add("loaded");
    try { startHero(); } catch (e) { revealHero(); }
  }
  function revealHero() {
    var sel = ".hero__title .line > span, .hero__sub, .hero__manifesto, .hero__actions, .hero__stats, .hero__portrait, .hero__badge";
    document.querySelectorAll(sel).forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none"; el.style.filter = "none";
    });
    runCounters();
  }

  (function preloader() {
    var bar = document.getElementById("preloader-bar");
    var count = document.getElementById("preloader-count");
    if (reduce) { finishLoad(); return; }
    var p = 0;
    var tick = setInterval(function () {
      p = Math.min(100, p + Math.random() * 18 + 8);
      if (bar) bar.style.width = p + "%";
      if (count) count.textContent = Math.floor(p) + "%";
      if (p >= 100) { clearInterval(tick); setTimeout(finishLoad, 300); }
    }, 100);
    // Hard cap so the preloader can never trap the page on a black screen.
    setTimeout(function () {
      if (!document.body.classList.contains("loaded")) { clearInterval(tick); finishLoad(); }
    }, 2600);
  })();

  /* ───────── Reveal system - batched, staggered, cinematic ─────────
     ScrollTrigger.batch groups elements entering together (e.g. a row of
     cards) and staggers them for a sequenced reveal. */
  function initReveals() {
    if (reduce || !hasST) { revealAll(); return; }
    var g = window.gsap;
    window.ScrollTrigger.batch("[data-rv]", {
      start: "top 86%",
      onEnter: function (batch) {
        g.to(batch, {
          opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)",
          duration: 1.0, ease: "power3.out", stagger: 0.12, overwrite: true,
        });
      },
    });
  }

  /* ───────── GSAP plugin registration ───────── */
  if (hasST) { try { window.gsap.registerPlugin(window.ScrollTrigger); } catch (e) {} }

  /* ───────── Lenis smooth scroll (isolated - cannot break reveals) ───────── */
  if (hasLenis && !reduce) {
    try {
      lenis = new window.Lenis({
        duration: 1.1,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
      });
      var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if (hasST) lenis.on("scroll", window.ScrollTrigger.update);
    } catch (e) { lenis = null; }
  }

  /* ───────── Smooth anchor links ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -90 });
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ───────── Hero entrance ───────── */
  function startHero() {
    if (reduce || !hasGSAP) { revealHero(); return; }
    var g = window.gsap;
    var tl = g.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__badge", { y: 16, opacity: 0, duration: 0.6 })
      .from(".hero__title .line > span", { yPercent: 110, duration: 1.0, stagger: 0.12 }, "-=0.3")
      .from(".hero__sub", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
      .from(".hero__manifesto", { y: 16, opacity: 0, duration: 0.7 }, "-=0.6")
      .from(".hero__actions", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero__stats .stat", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
      .from(".hero__portrait", { scale: 1.06, opacity: 0, duration: 1.2, ease: "power2.out" }, "-=1.2");
    runCounters();
    if (hasST) {
      g.to(".hero__glow--1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      g.to(".hero__glow--2", { yPercent: -20, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    }
  }

  /* ───────── Animated counters ───────── */
  var countersRun = false;
  function runCounters() {
    if (countersRun) return;
    countersRun = true;
    document.querySelectorAll(".stat__num").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var span = el.querySelector("span");
      var suffix = span ? span.outerHTML : "";
      if (reduce || !hasGSAP) { el.innerHTML = target + suffix; return; }
      var obj = { v: 0 };
      window.gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out", delay: 0.3,
        onUpdate: function () { el.innerHTML = Math.floor(obj.v) + suffix; },
        onComplete: function () { el.innerHTML = target + suffix; },
      });
    });
  }

  /* ───────── Nav hide/show + active section ───────── */
  var nav = document.getElementById("nav");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 40);
      if (y > lastY && y > 300) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
    }
    lastY = y;
  }, { passive: true });

  var navLinks = document.querySelectorAll(".nav__link");
  var sections = [].slice.call(navLinks)
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);
  function setActive(i) { navLinks.forEach(function (l, j) { l.classList.toggle("is-active", j === i); }); }
  if (hasST && !reduce) {
    sections.forEach(function (sec, i) {
      window.ScrollTrigger.create({
        trigger: sec, start: "top 50%", end: "bottom 50%",
        onToggle: function (self) { if (self.isActive) setActive(i); },
      });
    });
  } else {
    window.addEventListener("scroll", function () {
      var idx = 0;
      sections.forEach(function (sec, i) { if (sec.getBoundingClientRect().top < window.innerHeight * 0.5) idx = i; });
      setActive(idx);
    }, { passive: true });
  }

  /* ───────── Mobile menu ───────── */
  var burger = document.getElementById("burger");
  function toggleMenu() {
    document.body.classList.toggle("menu-open");
    if (lenis) { document.body.classList.contains("menu-open") ? lenis.stop() : lenis.start(); }
  }
  function closeMenu() {
    if (document.body.classList.contains("menu-open")) {
      document.body.classList.remove("menu-open");
      if (lenis) lenis.start();
    }
  }
  if (burger) burger.addEventListener("click", toggleMenu);

  /* ───────── Cursor glow ───────── */
  var glow = document.getElementById("cursor-glow");
  if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener("mousemove", function (e) { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ───────── Card spotlight ───────── */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ───────── Hero portrait cursor-spotlight reveal ───────── */
  var portrait = document.getElementById("portrait");
  if (portrait) {
    var reveal = portrait.querySelector(".portrait--reveal");
    var base = portrait.querySelector(".portrait--base");
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!reduce && fine) {
      var active = false;
      portrait.addEventListener("mouseenter", function () { active = true; if (reveal) reveal.style.setProperty("--spot-r", "150px"); });
      portrait.addEventListener("mouseleave", function () { active = false; if (reveal) reveal.style.setProperty("--spot-r", "0px"); });
      portrait.addEventListener("mousemove", function (e) {
        if (!active || !reveal) return;
        var r = portrait.getBoundingClientRect();
        reveal.style.setProperty("--spot-x", (((e.clientX - r.left) / r.width) * 100) + "%");
        reveal.style.setProperty("--spot-y", (((e.clientY - r.top) / r.height) * 100) + "%");
      });
    } else {
      // No hover (touch) or reduced-motion: show the colour portrait statically.
      if (reveal) { reveal.style.webkitMaskImage = "none"; reveal.style.maskImage = "none"; reveal.style.opacity = 1; }
      if (base) base.style.opacity = 0;
    }
  }

  /* ───────── Infinite ticker ───────── */
  var track = document.getElementById("ticker-track");
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML; // seamless loop
    if (hasGSAP && !reduce) {
      try {
        var half = track.scrollWidth / 2;
        var tween = window.gsap.to(track, { x: -half, duration: 28, ease: "none", repeat: -1 });
        track.parentElement.addEventListener("mouseenter", function () { tween.timeScale(0.25); });
        track.parentElement.addEventListener("mouseleave", function () { tween.timeScale(1); });
      } catch (e) {}
    }
  }

  /* ───────── Seamless hero video fade-loop (Motion 15) ─────────
     Custom rAF crossfade at the loop boundary so there's no hard cut. */
  var heroVideo = document.getElementById("hero-video");
  if (heroVideo && !reduce && window.innerWidth > 768) {
    var FADE_MS = 500, LEAD = 0.55, vraf = null, fadingOut = false;
    heroVideo.style.opacity = "0";
    var fadeTo = function (target) {
      if (vraf) cancelAnimationFrame(vraf);
      var start = parseFloat(heroVideo.style.opacity) || 0, t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / FADE_MS);
        heroVideo.style.opacity = (start + (target - start) * p).toFixed(3);
        if (p < 1) vraf = requestAnimationFrame(step);
      };
      vraf = requestAnimationFrame(step);
    };
    var safePlay = function () { var pl = heroVideo.play(); if (pl && pl.catch) pl.catch(function () {}); };
    heroVideo.addEventListener("loadeddata", function () { heroVideo.style.opacity = "0"; safePlay(); fadeTo(1); });
    heroVideo.addEventListener("timeupdate", function () {
      var left = heroVideo.duration - heroVideo.currentTime;
      if (!fadingOut && heroVideo.duration && left <= LEAD && left > 0) { fadingOut = true; fadeTo(0); }
    });
    heroVideo.addEventListener("ended", function () {
      heroVideo.style.opacity = "0";
      setTimeout(function () { heroVideo.currentTime = 0; safePlay(); fadingOut = false; fadeTo(1); }, 100);
    });
    // If it's already loaded (cached), kick it off.
    if (heroVideo.readyState >= 2) { safePlay(); fadeTo(1); }
  }

  /* ───────── Show more / fewer projects ───────── */
  var workMore = document.getElementById("work-more");
  if (workMore) {
    var workGrid = document.querySelector(".work__grid");
    workMore.addEventListener("click", function () {
      var expanded = workGrid.classList.toggle("is-expanded");
      workMore.classList.toggle("is-open", expanded);
      if (expanded) {
        // these cards were display:none, so the scroll reveal never fired — reveal them now
        workGrid.querySelectorAll(".work-hidden").forEach(function (c) { c.classList.add("rv-in"); });
      }
      workMore.firstChild.textContent = expanded ? "Show fewer projects " : "Show 2 more projects ";
      if (hasST) window.ScrollTrigger.refresh();
    });
  }

  /* ───────── Contact form → mailto bridge ───────── */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var who = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var subject = encodeURIComponent("Project enquiry from " + (who || "your site"));
      var body = encodeURIComponent("Name: " + who + "\nEmail: " + email + "\n\n" + message);
      window.location.href = "mailto:johnsavilesh@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* ───────── Kick off reveals ───────── */
  if (document.readyState !== "loading") initReveals();
  else document.addEventListener("DOMContentLoaded", initReveals);

  window.addEventListener("load", function () {
    if (hasST) setTimeout(function () { window.ScrollTrigger.refresh(); }, 300);
  });
})();
