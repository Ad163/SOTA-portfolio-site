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

  var work = document.querySelector("#work");
  if (work) {
    var proof = document.createElement("section");
    proof.className = "technical-proof wrap";
    proof.id = "proof";
    proof.innerHTML = '<div class="technical-heading"><p class="section-number">PROOF / 01</p><h2>Systems with a<br><em>visible chain of reasoning.</em></h2><p>Strong AI work should be inspectable. These are the shapes behind the outcomes: data into decisions, retrieval into verified answers.</p></div><div class="proof-panels"><article class="flow-panel"><div class="panel-label">GeoPredict AI / decision flow</div><div class="flow-track"><div><b>01</b><strong>Subsurface data</strong><small>seismic · well-log · core</small></div><i></i><div><b>02</b><strong>Feature synthesis</strong><small>signals · context · quality</small></div><i></i><div><b>03</b><strong>Reservoir insight</strong><small>characterisation · drilling</small></div></div><div class="panel-note">Decision support for energy teams, designed around evidence instead of black-box confidence.</div></article><article class="eval-panel"><div class="panel-label">LegalRAG / evaluation lift</div><div class="eval-bars"><div><span>Before rebuild</span><b>29%</b><i style="width:29%"></i></div><div><span>After evaluation redesign</span><b>96.7%</b><i style="width:96.7%"></i></div><div><span>Citation-backed answers</span><b>100%</b><i style="width:100%"></i></div></div><div class="panel-note">Measurement quality drove the gain: hybrid retrieval, reranking, citation checks, and regression coverage.</div></article></div>';
    work.after(proof);
  }

  var statement = document.querySelector(".statement");
  if (statement) {
    var control = document.createElement("section");
    control.className = "control-strip";
    control.id = "platform";
    control.innerHTML = '<div class="wrap control-inner"><div><p class="section-number">PLATFORM / CONTROL PLANE</p><strong>Every generation leaves a trail.</strong></div><div class="control-items"><span><b>ROUTE</b> latency / cost / quality</span><span><b>TRACE</b> prompt / model / tokens</span><span><b>EVALUATE</b> groundedness / safety</span><span><b>RECOVER</b> retry / fallback / human</span></div></div>';
    statement.after(control);
  }
})();
