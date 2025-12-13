(function () {
  "use strict";

  const travel = {
    "Вологодская": { fee: 9000, cities: { "Вологда": 9000, "Череповец": 15000, "Сокол": 12000 } },
    "Владимирская": { fee: 10000, cities: { "Владимир": 10000, "Ковров": 10000, "Муром": 17000, "Гусь хрустальный": 13500 } },
    "Ивановская": { fee: 5000, cities: { "Иваново": 2000, "Кинешма": 3500, "Шуя": 3000, "Тейково": 2500 } },
    "Костромская": { fee: 3000, cities: { "Кострома": 2000, "Шарья": 6000, "Нерехта": 2000 } },
    "Ярославская": { fee: 1000, cities: { "Ярославль": 0, "Рыбинск": 2000, "Тутаев": 2000, "Углич": 2000, "Ростов": 2000 } }
  };

  const p = v => ({ p: v });

  const services = {
    kids: {
      "Детское шоу (30 мин)": p(11250),
      "Детское шоу (40 мин)": p(13750),
      "Индив. детское (30 мин)": { p: 21250, d: "Шоу + фокус имениннику" }
    },
    std: {
      "Взрослое шоу (20 мин)": { p: 17500, d: "Сет из 3–4 трюков" },
      "Взрослое шоу (30 мин)": { p: 23750, d: "Универсальный" },
      "Взрослое шоу (40 мин)": { p: 30000, d: "Расширенный" }
    },
    close: {
      "Микромагия (30 мин)": { p: 13000, d: "Фокусы в руках" },
      "Микромагия (1 ч)": { p: 20000 },
      "Микромагия (2 ч)": { p: 30000 }
    },
    spec: {
      "Свадебное (20 мин)": { p: 26250 },
      "Свадебное (30 мин)": { p: 32500 },
      "Корпоратив (20 мин)": { p: 26250 },
      "Корпоратив (30 мин)": { p: 32500 },
      "Юбилей": { p: 23750 }
    },
    conc: {
      "Мини-шоу «СЕКРЕТ» (1 ч)": { p: 150000 },
      "Спектакль «СЕКРЕТ» (2 ч)": { p: 300000 }
    }
  };

  const catNames = { kids: "Детские", std: "Взрослые", close: "Микромагия", spec: "Спец-шоу", conc: "Концерт" };

  function qs(id) { return document.getElementById(id); }
  function existsAll(ids) { return ids.every(id => qs(id)); }

  function initCalc() {
    if (!existsAll(["area", "city", "cat", "svc", "guests", "gRange", "gNum", "desc", "wizProgress"])) return;

    const area = qs("area");
    const city = qs("city");
    const cat = qs("cat");
    const svc = qs("svc");
    const guests = qs("guests");
    const sliderWrap = qs("slider");
    const gRange = qs("gRange");
    const gNum = qs("gNum");
    const desc = qs("desc");

    Object.keys(travel).forEach(k => area.add(new Option(k, k)));
    Object.keys(services).forEach(k => cat.add(new Option(catNames[k], k)));

    area.addEventListener("change", () => {
      const a = area.value;
      city.innerHTML = '<option disabled selected>Город</option>';
      city.disabled = false;
      Object.keys(travel[a].cities).forEach(c => city.add(new Option(c, c)));
    });

    cat.addEventListener("change", () => {
      const c = cat.value;
      svc.innerHTML = '<option disabled selected>Программа</option>';
      svc.disabled = false;
      Object.keys(services[c]).forEach(k => svc.add(new Option(k, k)));
      desc.textContent = "";
    });

    svc.addEventListener("change", () => {
      const c = cat.value;
      const s = svc.value;
      desc.textContent = (services[c][s] && services[c][s].d) ? services[c][s].d : "";
    });

    function toggleSlider() {
      if (!sliderWrap) return;
      sliderWrap.style.display = guests.value === "custom" ? "flex" : "none";
    }
    guests.addEventListener("change", toggleSlider);
    toggleSlider();

    gRange.addEventListener("input", () => { gNum.textContent = gRange.value; });

    // step controls
    const nextTo2 = qs("nextTo2");
    const backTo1 = qs("backTo1");
    const calcBtn = qs("calcBtn");
    const editCalc = qs("editCalc");

    nextTo2 && nextTo2.addEventListener("click", () => nextStep(2));
    backTo1 && backTo1.addEventListener("click", () => nextStep(1));
    editCalc && editCalc.addEventListener("click", () => nextStep(2));
    calcBtn && calcBtn.addEventListener("click", calcResult);
  }

  function nextStep(n) {
    const area = document.getElementById("area");
    const city = document.getElementById("city");
    if (n === 2 && (!area.value || !city.value)) { alert("Выберите регион и город"); return; }

    document.querySelectorAll(".wizard-step").forEach(e => e.classList.remove("active"));
    const step = document.getElementById("step" + n);
    if (step) step.classList.add("active");

    const bar = document.getElementById("wizProgress");
    if (bar) bar.style.width = (n === 3 ? 100 : n * 33) + "%";
  }

  function calcResult() {
    const svc = document.getElementById("svc");
    const cat = document.getElementById("cat");
    if (!svc || !svc.value) { alert("Выберите программу"); return; }

    const catVal = cat.value;
    const svcVal = svc.value;

    let base = services[catVal][svcVal].p;

    const area = document.getElementById("area").value;
    const city = document.getElementById("city").value;

    let road = travel[area].fee;
    if (travel[area].cities[city] !== undefined) road = travel[area].cities[city];

    // оригинальная логика: если Ярославль в Ярославской области — +1000 к базе
    if (area === "Ярославская" && city === "Ярославль") base += 1000;

    const gSelect = document.getElementById("guests").value;
    const gCount = gSelect === "custom" ? parseInt(document.getElementById("gRange").value, 10) : 0;
    const gFee = gSelect === "custom"
      ? Math.max(0, (gCount - 200) * 80)
      : parseInt(gSelect, 10);

    const total = base + road + gFee;

    const rTotal = document.getElementById("rTotal");
    if (rTotal) rTotal.textContent = total.toLocaleString("ru-RU") + " ₽";

    const breakdown = document.getElementById("breakdown");
    if (breakdown) {
      breakdown.innerHTML = `
        <div>Услуга: <b>${base.toLocaleString("ru-RU")} ₽</b></div>
        <div>Дорога: <b>${road.toLocaleString("ru-RU")} ₽</b></div>
        <div>Гости: <b>${gFee.toLocaleString("ru-RU")} ₽</b></div>
      `;
      breakdown.style.display = "block";
    }

    nextStep(3);
  }

  document.addEventListener("DOMContentLoaded", initCalc);
})();