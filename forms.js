(function () {
  "use strict";

  // ВАЖНО: сюда вставь webhook (n8n / backend)
  const WEBHOOK_URL = "https://YOUR_N8N_DOMAIN/webhook/kostyuk-leads";

  function phoneMask(el) {
    el.addEventListener("input", (e) => {
      let x = e.target.value.replace(/\D/g, "").match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x) return;
      if (!x[2] && x[1] !== "") e.target.value = "+7 (" + x[1];
      else e.target.value =
        !x[2] ? x[1] :
          "+7 (" + x[2] +
          (x[3] ? ") " + x[3] : "") +
          (x[4] ? "-" + x[4] : "") +
          (x[5] ? "-" + x[5] : "");
    });
  }

  async function postJSON(url, data) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res;
  }

  function setHint(form, text, type) {
    const hint = form.querySelector(".form-hint") || document.getElementById(form.id + "Hint");
    if (!hint) return;
    hint.classList.remove("ok", "err");
    if (type === "ok") hint.classList.add("ok");
    if (type === "err") hint.classList.add("err");
    hint.textContent = text;
  }

  function bindForm(form) {
    const kind = form.getAttribute("data-lead-form") || "unknown";
    const btn = form.querySelector("button[type='submit'], button:not([type])");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // honeypot
      const hp = form.querySelector("input[name='website']");
      if (hp && hp.value) return;

      if (!WEBHOOK_URL || WEBHOOK_URL.includes("YOUR_N8N_DOMAIN")) {
        setHint(form, "Вставь WEBHOOK_URL в /js/forms.js", "err");
        alert("Нужно вставить WEBHOOK_URL в /js/forms.js");
        return;
      }

      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v, k) => payload[k] = String(v).trim());

      // минимальная валидация телефона/имени
      const phone = (payload.phone || "").replace(/\D/g, "");
      if (phone.length < 10) { setHint(form, "Проверь телефон — слишком короткий.", "err"); return; }

      // кнопка
      let oldText = "";
      if (btn) {
        oldText = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Отправка...";
      }

      setHint(form, "Отправляем заявку…", "");

      try {
        await postJSON(WEBHOOK_URL, {
          kind,
          page: location.pathname || location.href,
          ts: Date.now(),
          data: payload
        });

        setHint(form, "Готово! Мы свяжемся с вами.", "ok");
        form.reset();

        // спец: если есть окно thanksModal — покажем
        const thanks = document.getElementById("thanksModal");
        if (thanks) thanks.classList.add("visible");

      } catch (err) {
        console.error(err);
        setHint(form, "Ошибка отправки. Попробуйте позже.", "err");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = oldText || "Отправить";
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // маска телефона
    document.querySelectorAll("input[type='tel']").forEach(phoneMask);

    // привязка всех форм
    document.querySelectorAll("form[data-lead-form]").forEach(bindForm);

    // закрытие thanks (school page)
    const closeThanks = document.getElementById("closeThanks");
    if (closeThanks) {
      closeThanks.addEventListener("click", () => {
        const m = document.getElementById("thanksModal");
        if (m) m.classList.remove("visible");
      });
    }
  });
})();