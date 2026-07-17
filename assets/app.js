(() => {
  "use strict";
  const cfg = window.WEDDING_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function safeText(value, fallback = "") {
    return String(value ?? fallback).replace(/[<>]/g, "");
  }

  const params = new URLSearchParams(location.search);
  const guest = safeText(params.get("guest") || cfg.defaultGuest || "Quý khách");

  $$("[data-guest]").forEach(el => el.textContent = guest);
  $("#guestName").value = guest;

  const couple = cfg.couple || {};
  $$("[data-groom-first]").forEach(el => el.textContent = couple.groomFirst || "Xuân Trường");
  $$("[data-bride-first]").forEach(el => el.textContent = couple.brideFirst || "Thu Hằng");
  $$("[data-groom-full]").forEach(el => el.textContent = couple.groomFull || "Đoàn Xuân Trường");
  $$("[data-bride-full]").forEach(el => el.textContent = couple.brideFull || "Phan Thu Hằng");

  const opening = $("#openingScreen");
  const audio = $("#weddingMusic");
  const musicButton = $("#musicButton");
  let musicPlaying = false;

  async function toggleMusic(forcePlay) {
    try {
      if (forcePlay === true || !musicPlaying) {
        await audio.play();
        musicPlaying = true;
        musicButton.classList.add("playing");
      } else {
        audio.pause();
        musicPlaying = false;
        musicButton.classList.remove("playing");
      }
    } catch (error) {
      musicPlaying = false;
      musicButton.classList.remove("playing");
    }
  }

  $("#openInvitation").addEventListener("click", () => {
    opening.classList.add("hidden");
    document.body.classList.remove("no-scroll");
    toggleMusic(true);
  });
  musicButton.addEventListener("click", () => toggleMusic());
  document.body.classList.add("no-scroll");

  // Countdown
  const weddingDate = new Date((cfg.ceremony && cfg.ceremony.start) || "2026-08-02T09:30:00+07:00");
  function updateCountdown() {
    const diff = Math.max(0, weddingDate - new Date());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000) % 24;
    const minutes = Math.floor(diff / 60000) % 60;
    const seconds = Math.floor(diff / 1000) % 60;
    $("#days").textContent = String(days).padStart(2, "0");
    $("#hours").textContent = String(hours).padStart(2, "0");
    $("#minutes").textContent = String(minutes).padStart(2, "0");
    $("#seconds").textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => observer.observe(el));

  // Map links
  $$(".map-link").forEach(link => {
    const key = link.dataset.map;
    const data = cfg[key] || {};
    link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(data.mapQuery || data.address || "");
  });

  // ICS calendar file
  function icsDate(dateString) {
    const d = new Date(dateString);
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }
  function downloadCalendar(eventKey) {
    const event = cfg[eventKey];
    if (!event) return;
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Thiep Cuoi Xuan Truong Thu Hang//VI",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}-${eventKey}@wedding.local`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(event.start)}`,
      `DTEND:${icsDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.venue}, ${event.address}`,
      `DESCRIPTION:Trân trọng kính mời ${guest} đến chung vui cùng gia đình Xuân Trường và Thu Hằng.`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventKey}-02-08-2026.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }
  $$(".add-calendar").forEach(btn => btn.addEventListener("click", () => downloadCalendar(btn.dataset.event)));

  // Gift dialog
  const giftDialog = $("#giftDialog");
  const bankGrid = $("#bankGrid");
  (cfg.banks || []).forEach(bank => {
    const card = document.createElement("div");
    card.className = "bank-card";
    const label = document.createElement("span");
    label.textContent = bank.label || "";
    const bankName = document.createElement("strong");
    bankName.textContent = bank.bank || "Bổ sung sau";
    const owner = document.createElement("p");
    owner.textContent = bank.accountName || "";
    const number = document.createElement("p");
    number.textContent = bank.accountNumber || "Bổ sung sau";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-button";
    copy.textContent = "Sao chép STK";
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(bank.accountNumber || "");
      copy.textContent = "Đã sao chép";
      setTimeout(() => copy.textContent = "Sao chép STK", 1500);
    });
    card.append(label, bankName, owner, number, copy);
    bankGrid.append(card);
  });
  $("#openGift").addEventListener("click", () => giftDialog.showModal());
  $("[data-close-dialog]").addEventListener("click", () => giftDialog.close());

  // Image lightbox
  const imageDialog = $("#imageDialog");
  const lightboxImage = $("#lightboxImage");
  $$(".gallery-item").forEach(btn => btn.addEventListener("click", () => {
    lightboxImage.src = btn.dataset.image;
    imageDialog.showModal();
  }));
  $("[data-close-image]").addEventListener("click", () => imageDialog.close());

  // RSVP
  const form = $("#rsvpForm");
  const status = $("#formStatus");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      guestName: safeText(formData.get("guestName")),
      guestCount: safeText(formData.get("guestCount")),
      attendance: safeText(formData.get("attendance")),
      message: safeText(formData.get("message")),
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem("wedding-rsvp", JSON.stringify(payload));

    if (cfg.formEndpoint) {
      try {
        const response = await fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Submit failed");
        status.textContent = "Cảm ơn bạn! Xác nhận đã được gửi.";
        form.reset();
        return;
      } catch (error) {
        status.textContent = "Không gửi được qua máy chủ. Đã lưu xác nhận trên thiết bị.";
      }
    } else if (cfg.rsvpPhone) {
      const text = [
        "XÁC NHẬN THAM DỰ ĐÁM CƯỚI",
        `Khách mời: ${payload.guestName}`,
        `Số người: ${payload.guestCount}`,
        `Trạng thái: ${payload.attendance}`,
        `Lời nhắn: ${payload.message || "(không có)"}`
      ].join("\n");
      window.open(`https://wa.me/${cfg.rsvpPhone}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      status.textContent = "Đã mở WhatsApp để gửi xác nhận.";
    } else {
      const text = [
        "XÁC NHẬN THAM DỰ ĐÁM CƯỚI",
        `Khách mời: ${payload.guestName}`,
        `Số người: ${payload.guestCount}`,
        `Trạng thái: ${payload.attendance}`,
        `Lời nhắn: ${payload.message || "(không có)"}`
      ].join("\n");
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `xac-nhan-${payload.guestName || "khach-moi"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      status.textContent = "Đã lưu xác nhận thành file. Hãy gửi file này cho cô dâu/chú rể.";
    }
  });

  // Decorative petals
  const petalLayer = $(".petals");
  function addPetal() {
    if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = Math.random() > .5 ? "❀" : "♥";
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 8 + Math.random() * 12 + "px";
    petal.style.setProperty("--drift", `${-60 + Math.random() * 120}px`);
    petal.style.animationDuration = 6 + Math.random() * 6 + "s";
    petalLayer.append(petal);
    setTimeout(() => petal.remove(), 13000);
  }
  setInterval(addPetal, 900);
})();