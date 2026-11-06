(function () {
  "use strict";
  var menu = document.querySelector(".menu-button");
  var nav = document.querySelector(".nav-links");
  var header = document.querySelector(".site-header");
  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  if (menu && nav) {
    menu.setAttribute("aria-expanded", "false");
    menu.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", "Open menu");
      });
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

})();
