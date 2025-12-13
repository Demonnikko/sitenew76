(function () {
  "use strict";

  // Preloader
  window.addEventListener("load", () => {
    const pre = document.getElementById("preloader");
    if (pre) pre.classList.add("hide");

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".afisha-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.utils.toArray(".gs-reveal").forEach(elem => {
        gsap.from(elem, { scrollTrigger: { trigger: elem, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8 });
      });
    }
  });

  // Swiper per instance (фикс: раньше часто работал только первый)
  function initSwipers() {
    if (!window.Swiper) return;

    document.querySelectorAll(".mySwiper").forEach((el) => {
      const swiper = new Swiper(el, {
        pagination: {
          el: el.querySelector(".swiper-pagination"),
          clickable: true,
        },
        effect: "coverflow",
        coverflowEffect: {
          rotate: 0, stretch: 0, depth: 0, modifier: 1, slideShadows: false,
        },
        on: {
          slideChange: function () {
            const slides = this.slides;
            // видео всегда на втором слайде
            const videoSlide = slides && slides[1] ? slides[1].querySelector("video") : null;

            if (!videoSlide) return;
            if (this.activeIndex === 1) {
              videoSlide.currentTime = 0;
              videoSlide.play().catch(() => {});
            } else {
              videoSlide.pause();
            }
          }
        }
      });

      // стартовое состояние (если кто-то открыл сразу на 2-й)
      const s = swiper.slides && swiper.slides[1] ? swiper.slides[1].querySelector("video") : null;
      if (s) s.pause();
    });
  }

  document.addEventListener("DOMContentLoaded", initSwipers);
})();