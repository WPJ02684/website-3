(() => {
  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "開啟選單");
    }
  };

  const openMenu = () => {
    document.body.classList.add("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "關閉選單");
    }
  };

  toggle?.addEventListener("click", () => {
    if (document.body.classList.contains("menu-open")) closeMenu();
    else openMenu();
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("menu-open")) return;
    if (header?.contains(event.target)) return;
    closeMenu();
  });

  const bindFilters = (root, cards, empty, match) => {
    if (!root || !cards.length) return;
    const groups = {};

    const apply = () => {
      let shown = 0;
      cards.forEach((card) => {
        const visible = match(card, groups);
        card.hidden = !visible;
        if (visible) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    };

    root.querySelectorAll(".filter-btn").forEach((button) => {
      const key = button.dataset.filter;
      if (button.getAttribute("aria-pressed") === "true") groups[key] = button.dataset.value;
      button.addEventListener("click", () => {
        root.querySelectorAll(`.filter-btn[data-filter="${key}"]`).forEach((item) => {
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
        groups[key] = button.dataset.value;
        apply();
      });
    });
  };

  const jobFilters = document.querySelector("[data-job-filters]");
  const jobCards = [...document.querySelectorAll("[data-job-card]")];
  bindFilters(jobFilters, jobCards, document.querySelector("[data-job-empty]"), (card, groups) => {
    return ["region", "shift", "type"].every((key) => {
      const value = groups[key] || "all";
      return value === "all" || card.dataset[key] === value;
    });
  });

  const noticeFilters = document.querySelector("[data-notice-filters]");
  const noticeCards = [...document.querySelectorAll("[data-notice-card]")];
  const noticeQuery = document.querySelector("[data-notice-query]");
  const noticeStatus = document.querySelector("[data-notice-status]");
  const noticeEmpty = document.querySelector("[data-notice-empty]");
  const noticeDetail = document.querySelector("[data-notice-detail]");

  const applyNotices = () => {
    const query = (noticeQuery?.value || "").trim().toLowerCase();
    const status = noticeStatus?.value || "all";
    let shown = 0;
    noticeCards.forEach((card) => {
      const id = (card.dataset.id || "").toLowerCase();
      const matchId = !query || id.includes(query);
      const matchStatus = status === "all" || card.dataset.status === status;
      const visible = matchId && matchStatus;
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (noticeEmpty) noticeEmpty.hidden = shown !== 0;
    if (noticeDetail) noticeDetail.hidden = shown === 0;
  };

  if (noticeFilters) {
    noticeQuery?.addEventListener("input", applyNotices);
    noticeStatus?.addEventListener("change", applyNotices);
    applyNotices();
  }

  const form = document.querySelector("[data-clue-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = form.querySelector("[data-form-error]");
    const success = form.querySelector("[data-form-success]");
    const id = form.querySelector("[name='noticeId']");
    const clue = form.querySelector("[name='clue']");
    const consent = form.querySelector("[name='consent']");
    const missing = [];
    if (!id.value.trim()) missing.push("公告編號");
    if (!clue.value.trim()) missing.push("線索內容");
    if (!consent.checked) missing.push("個人資料使用說明");
    if (missing.length) {
      error.hidden = false;
      error.textContent = `請完成：${missing.join("、")}`;
      success.hidden = true;
      return;
    }
    error.hidden = true;
    success.hidden = false;
    form.reset();
  });
})();
