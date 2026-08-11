(function () {
  const sticker = document.getElementById("game-sticker");
  const backdrop = document.getElementById("game-modal-backdrop");
  const closeBtn = document.getElementById("game-close");
  const startScreen = document.getElementById("game-start-screen");
  const endScreen = document.getElementById("game-end-screen");
  const startBtn = document.getElementById("game-start-btn");
  const restartBtn = document.getElementById("game-restart-btn");
  const scoreEl = document.getElementById("game-score");
  const timerEl = document.getElementById("game-timer");
  const finalScoreEl = document.getElementById("game-final-score");
  const ratingEl = document.getElementById("game-rating");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const LANE_COUNT = 4;
  const LANE_WIDTH = WIDTH / LANE_COUNT;
  const DB_ZONE_HEIGHT = 48;
  const GAME_DURATION = 30;
  const PACKET_SIZE = 64;

  const VALID_LABELS = ["Python", "SQL", "Power Apps", "ML"];
  const BUG_LABELS = ["NullPointer", "404", "SyntaxError", "DataLeak"];

  let packets = [];
  let particles = [];
  let score = 0;
  let timeLeft = GAME_DURATION;
  let running = false;
  let lastSpawn = 0;
  let lastFrameTime = 0;
  let countdownInterval = null;
  let rafId = null;

  function openModal() {
    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    resetToStartScreen();
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    stopLoops();
  }

  function resetToStartScreen() {
    stopLoops();
    packets = [];
    particles = [];
    score = 0;
    timeLeft = GAME_DURATION;
    scoreEl.textContent = "0";
    timerEl.textContent = String(GAME_DURATION);
    startScreen.hidden = false;
    endScreen.hidden = true;
    render();
  }

  function startGame() {
    packets = [];
    particles = [];
    score = 0;
    timeLeft = GAME_DURATION;
    scoreEl.textContent = "0";
    timerEl.textContent = String(GAME_DURATION);
    startScreen.hidden = true;
    endScreen.hidden = true;
    running = true;
    lastSpawn = 0;
    lastFrameTime = performance.now();

    countdownInterval = setInterval(() => {
      timeLeft -= 1;
      timerEl.textContent = String(Math.max(timeLeft, 0));
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    rafId = requestAnimationFrame(loop);
  }

  function stopLoops() {
    running = false;
    if (countdownInterval) clearInterval(countdownInterval);
    if (rafId) cancelAnimationFrame(rafId);
    countdownInterval = null;
    rafId = null;
  }

  function endGame() {
    stopLoops();
    finalScoreEl.textContent = String(score);
    ratingEl.textContent = getRating(score);
    endScreen.hidden = false;
  }

  function getRating(finalScore) {
    if (finalScore >= 150) return "🏆 Senior Pipeline Architect";
    if (finalScore >= 100) return "🚀 Lead Data Engineer";
    if (finalScore >= 60) return "🛠️ Data Engineer";
    if (finalScore >= 30) return "🌱 Junior Developer";
    return "☕ Junior Intern (needs more coffee)";
  }

  function updateScore(delta) {
    score += delta;
    scoreEl.textContent = String(score);
  }

  function spawnPacket(elapsedFraction) {
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const isBug = Math.random() < 0.42;
    const x = lane * LANE_WIDTH + LANE_WIDTH / 2;
    packets.push({
      x,
      y: -PACKET_SIZE / 2,
      size: PACKET_SIZE,
      isBug,
      label: isBug
        ? BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)]
        : VALID_LABELS[Math.floor(Math.random() * VALID_LABELS.length)],
      speed: 70 + elapsedFraction * 90 + Math.random() * 20,
      squished: false,
      squishT: 0,
    });
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    const elapsedFraction = 1 - timeLeft / GAME_DURATION;

    if (now - lastSpawn > Math.max(900 - elapsedFraction * 500, 380)) {
      spawnPacket(elapsedFraction);
      lastSpawn = now;
    }

    update(dt);
    render();

    rafId = requestAnimationFrame(loop);
  }

  function update(dt) {
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      if (p.squished) {
        p.squishT += dt;
        if (p.squishT > 0.25) packets.splice(i, 1);
        continue;
      }
      p.y += p.speed * dt;
      if (p.y - p.size / 2 > HEIGHT - DB_ZONE_HEIGHT) {
        if (p.isBug) {
          updateScore(-10);
          spawnFeedback(p.x, HEIGHT - DB_ZONE_HEIGHT, "-10", "#ff5b5b");
        }
        packets.splice(i, 1);
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].t += dt;
      particles[i].y -= dt * 30;
      if (particles[i].t > 0.8) particles.splice(i, 1);
    }
  }

  function spawnFeedback(x, y, text, color) {
    particles.push({ x, y, text, color, t: 0 });
  }

  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    packets.forEach(drawPacket);
    particles.forEach(drawParticle);
  }

  function drawBackground() {
    ctx.fillStyle = "#0b0c0f";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 1; i < LANE_COUNT; i++) {
      const x = i * LANE_WIDTH;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, HEIGHT - DB_ZONE_HEIGHT);
      ctx.stroke();
    }

    const dbY = HEIGHT - DB_ZONE_HEIGHT;
    const grad = ctx.createLinearGradient(0, dbY, 0, HEIGHT);
    grad.addColorStop(0, "rgba(255,106,26,0.15)");
    grad.addColorStop(1, "rgba(255,106,26,0.35)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, dbY, WIDTH, DB_ZONE_HEIGHT);

    ctx.strokeStyle = "rgba(255,106,26,0.6)";
    ctx.beginPath();
    ctx.moveTo(0, dbY);
    ctx.lineTo(WIDTH, dbY);
    ctx.stroke();

    ctx.fillStyle = "#ffb787";
    ctx.font = "600 13px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PRODUCTION DATABASE", WIDTH / 2, dbY + DB_ZONE_HEIGHT / 2);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawPacket(p) {
    const scale = p.squished ? Math.max(0, 1 - p.squishT / 0.25) : 1;
    if (scale <= 0) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(scale, scale);

    const half = p.size / 2;
    let fill;
    if (p.isBug) {
      const flash = Math.sin(performance.now() / 120) > 0;
      fill = flash ? "#ff4d4d" : "#c62828";
    } else {
      fill = "#34c759";
    }

    ctx.fillStyle = fill;
    roundRect(-half, -half, p.size, p.size, 12);
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.font = "700 11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.label, 0, 0, p.size - 10);

    ctx.restore();
  }

  function drawParticle(pt) {
    const alpha = Math.max(0, 1 - pt.t / 0.8);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = pt.color;
    ctx.font = "700 15px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(pt.text, pt.x, pt.y);
    ctx.globalAlpha = 1;
  }

  function getPointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  function handlePointerDown(evt) {
    if (!running) return;
    const pos = getPointerPos(evt);
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      if (p.squished) continue;
      const half = p.size / 2;
      if (Math.abs(pos.x - p.x) <= half && Math.abs(pos.y - p.y) <= half) {
        p.squished = true;
        if (p.isBug) {
          updateScore(10);
          spawnFeedback(p.x, p.y, "+10", "#34c759");
        } else {
          updateScore(-5);
          spawnFeedback(p.x, p.y, "-5", "#ff8a3d");
        }
        break;
      }
    }
  }

  canvas.addEventListener("pointerdown", handlePointerDown);

  sticker.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  render();
})();
