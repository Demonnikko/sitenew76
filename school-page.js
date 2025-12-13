(function () {
  "use strict";

  // Scroll reveals
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".gs-reveal").forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        y: 40, opacity: 0, duration: 0.8, ease: "power3.out"
      });
    });
  }

  // Timer (3 days rolling)
  (function () {
    const dEl = document.getElementById("d");
    const hEl = document.getElementById("h");
    const mEl = document.getElementById("m");
    if (!dEl || !hEl || !mEl) return;

    const deadline = Date.now() + 3 * 24 * 60 * 60 * 1000;

    function tick() {
      const diff = deadline - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      dEl.textContent = String(d).padStart(2, "0");
      hEl.textContent = String(h).padStart(2, "0");
      mEl.textContent = String(m).padStart(2, "0");
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // Video modal
  const mentor = document.getElementById("mentorVideo");
  const modal = document.getElementById("modalVideo");
  const closeBtn = document.getElementById("closeVideoBtn");
  const cont = document.getElementById("vidContainer");

  function openVideo() {
    if (!modal || !cont) return;
    modal.classList.add("visible");
    cont.innerHTML = '<iframe src="https://rutube.ru/play/embed/a692a6ad3b922abc4cfad5be5898431b?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
  }
  function closeVideo() {
    if (!modal || !cont) return;
    modal.classList.remove("visible");
    cont.innerHTML = "";
  }

  mentor && mentor.addEventListener("click", openVideo);
  closeBtn && closeBtn.addEventListener("click", closeVideo);
  modal && modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
})();