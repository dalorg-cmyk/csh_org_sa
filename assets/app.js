(() => {
  // ✅ رقم واتساب
  const WHATSAPP_NUMBER = "966165317007";

  // زر واتساب + الرقم في الصفحة
  const waBtn = document.getElementById("waBtn");
  const metaText = document.getElementById("metaText");

  waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  metaText.textContent = `واتساب: ${WHATSAPP_NUMBER}`;

  document.getElementById("year").textContent = new Date().getFullYear();

  // Ripple effect
  waBtn.addEventListener("click", (e) => {
    const rect = waBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = document.createElement("span");
    s.className = "ripple";
    s.style.left = x + "px";
    s.style.top = y + "px";
    waBtn.appendChild(s);

    setTimeout(() => s.remove(), 700);
  });

  // Sheen يتبع الماوس (على الأجهزة اللمسية قد لا يعمل، طبيعي)
  const card = document.getElementById("card");
  const sheen = document.getElementById("sheen");

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    sheen.style.setProperty("--sx", px + "%");
    sheen.style.setProperty("--sy", py + "%");
    sheen.style.opacity = ".75";
  });
  card.addEventListener("mouseleave", () => {
    sheen.style.opacity = ".55";
  });

  // ===== خلفية Canvas تفاعلية ناعمة =====
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W = 0, H = 0;

  const palette = [
    { r: 15,  g: 124, b: 130, a: 0.22 }, // teal
    { r: 121, g: 176, b: 91,  a: 0.18 }, // green
    { r: 90,  g: 159, b: 214, a: 0.18 }, // blue
  ];

  let mouse = { x: 0.5, y: 0.5, active: false };

  const bubbles = [];
  const COUNT = 16;

  function resize() {
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);

    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    bubbles.length = 0;
    for (let i = 0; i < COUNT; i++){
      const p = palette[i % palette.length];
      bubbles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 90 + Math.random() * 140,
        vx: (-0.25 + Math.random() * 0.5),
        vy: (-0.22 + Math.random() * 0.44),
        p
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const mx = mouse.x * W;
    const my = mouse.y * H;

    for (const b of bubbles) {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -b.r) b.x = W + b.r;
      if (b.x > W + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = H + b.r;
      if (b.y > H + b.r) b.y = -b.r;

      // انجذاب بسيط للماوس
      const dx = mx - b.x;
      const dy = my - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const pull = mouse.active ? 0.002 : 0.0008;
      b.x += (dx / dist) * (dist * pull);
      b.y += (dy / dist) * (dist * pull);

      const { r, g, b:bb, a } = b.p;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${r},${g},${bb},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${bb},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  window.addEventListener("resize", resize);

  resize();
  draw();
})();
