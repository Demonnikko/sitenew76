(function () {
  "use strict";

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // Safe reveal (если GSAP не загрузился — сайт не должен умереть)
  function initScrollReveal() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    qsa(".gs-reveal").forEach(elem => {
      gsap.from(elem, {
        scrollTrigger: { trigger: elem, start: "top 85%" },
        y: 30, opacity: 0, duration: 0.8
      });
    });
  }

  function lockBodyUntilLoaded() {
    // Фолбэк: даже если GSAP/шрифты/что угодно не загрузится — открываем скролл.
    const forceUnlockMs = 2800;
    const t = setTimeout(() => {
      document.body.classList.add("loaded");
      const curtain = qs("#curtain");
      if (curtain) curtain.classList.add("finished");
    }, forceUnlockMs);

    window.addEventListener("load", () => {
      clearTimeout(t);
    });
  }

  function runCurtainSequence() {
    const curtain = qs("#curtain");
    if (!curtain) {
      document.body.classList.add("loaded");
      return;
    }

    // если GSAP есть — красиво; если нет — просто спрячем
    if (!window.gsap) {
      document.body.classList.add("loaded");
      curtain.classList.add("finished");
      return;
    }

    if (history.scrollRestoration) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.add("loaded");
        const heroImg = qs(".hero-img");
        if (heroImg) heroImg.style.opacity = 1;

        curtain.classList.add("finished");
      }
    });

    tl.to(".curtain-text", { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" })
      .to(".curtain-panel.left", { xPercent: -100, duration: 1.3, ease: "power2.inOut" }, "+=0.2")
      .to(".curtain-panel.right", { xPercent: 100, duration: 1.3, ease: "power2.inOut" }, "<")
      .to(".curtain-content", { opacity: 0, duration: 0.4 }, "<")
      .to(".curtain-bg", { opacity: 0, duration: 0.5 }, "-=0.9")
      .from(".hero-title", { y: 50, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.7")
      .from(".hero-desc", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
      .from(".hero-btns", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5");
  }

  function initMenuAndModals() {
    const menu = qs("#mobileMenu");
    const burgerBtn = qs("#burgerBtn");
    const openSchoolBtn = qs("#openSchoolBtn");
    const schoolModal = qs("#schoolModal");
    const closeSchoolBtn = qs("#closeSchoolBtn");

    function setMenu(open) {
      if (!menu || !burgerBtn) return;
      menu.classList.toggle("open", open);
      burgerBtn.classList.toggle("active", open);
      burgerBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
    }

    if (burgerBtn && menu) {
      burgerBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
      // Закрывать меню по клику на ссылки
      qsa(".navlink", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
      // ESC
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
    }

    function openModal(el) {
      if (!el) return;
      el.classList.add("open");
      el.setAttribute("aria-hidden", "false");
    }
    function closeModal(el) {
      if (!el) return;
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    }

    // Видео модалка (index)
    const modalVideo = qs("#modalVideo");
    const openVideoBtn = qs("#openVideoBtn");
    const closeVideoBtn = qs("#closeVideoBtn");
    const vidContainer = qs("#vidContainer");

    if (openVideoBtn && modalVideo && vidContainer) {
      openVideoBtn.addEventListener("click", () => {
        openModal(modalVideo);
        vidContainer.innerHTML = '<iframe src="https://rutube.ru/play/embed/a692a6ad3b922abc4cfad5be5898431b?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
      });
    }
    if (closeVideoBtn && modalVideo && vidContainer) {
      closeVideoBtn.addEventListener("click", () => {
        closeModal(modalVideo);
        vidContainer.innerHTML = "";
      });
    }
    if (modalVideo) {
      modalVideo.addEventListener("click", (e) => {
        if (e.target === modalVideo) {
          closeModal(modalVideo);
          if (vidContainer) vidContainer.innerHTML = "";
        }
      });
    }

    // Школа модалка
    if (openSchoolBtn && schoolModal) {
      openSchoolBtn.addEventListener("click", () => {
        setMenu(false);
        openModal(schoolModal);
      });
    }
    if (closeSchoolBtn && schoolModal) {
      closeSchoolBtn.addEventListener("click", () => closeModal(schoolModal));
      schoolModal.addEventListener("click", (e) => { if (e.target === schoolModal) closeModal(schoolModal); });
    }
  }

  function initFaq() {
    const faqContainer = qs("#faqContainer");
    if (!faqContainer) return;

    const faqData = [
      { q: "За сколько бронировать?", a: "Обычно за 1–2 недели." },
      { q: "Сколько длится шоу?", a: "От 20 мин до 2 часов." },
      { q: "Работаете по договору?", a: "Да, ИП/Самозанятость." },
      { q: "Выезжаете в область?", a: "Да, условия в калькуляторе." },
      { q: "Нужна ли сцена?", a: "Не обязательно, работаем и в welcome-зоне." },
      { q: "Можно с детьми?", a: "Да, есть детские программы." },
      { q: "Можно снимать видео?", a: "Да, конечно!" },
      { q: "Какие условия оплаты?", a: "Предоплата 50%, остаток в день шоу." }
    ];

    faqContainer.innerHTML =
      faqData.map((f, i) =>
        `<details class="faq-item ${i >= 4 ? "hidden" : ""}">
          <summary>${f.q}</summary>
          <div>${f.a}</div>
        </details>`
      ).join("") +
      `<div class="faq-controls">
        <button class="btn btn-glass" id="showAllFaqBtn" type="button">Показать все</button>
      </div>`;

    const btn = qs("#showAllFaqBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        qsa(".faq-item.hidden", faqContainer).forEach(item => item.classList.remove("hidden"));
        btn.style.display = "none";
      });
    }
  }

  // Boot
  lockBodyUntilLoaded();
  document.addEventListener("DOMContentLoaded", () => {
    runCurtainSequence();
    initMenuAndModals();
    initFaq();
    initScrollReveal();
  });
})();