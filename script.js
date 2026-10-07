(function () {
  const cfg = window.CARD_CONFIG;
  const $ = (id) => document.getElementById(id);

  // ---------- content ----------
  $("friend-name").textContent = cfg.friendName;
  $("message").textContent = cfg.message;
  $("from").textContent = cfg.from;

  // ---------- nicknames ----------
  const user = 'Holy Reap';
  // [style, text]: "cmd" lines are typed, "out" lines appear at once like program output
  const terminalLines = [
    ["cmd", "$ g++ birthday.cpp -o birthday && ./birthday"],
    ["out", `Congrats, ${user}! You have completed a new level!`]
  ];

  const TYPE_DELAY = 55;      // ms per character
  const COMPILE_DELAY = 1200; // "compiling" pause before the program output

  function typeTerminal(done) {
    const el = $("terminal");
    let line = 0;
    let c = 0;
    let span = null;
    (function step() {
      if (line >= terminalLines.length) { done(); return; }
      const [cls, text] = terminalLines[line];
      if (c === 0) {
        if (line > 0) el.append("\n");
        span = document.createElement("span");
        span.className = `t-${cls}`;
        el.append(span);
      }
      if (cls === "out") {
        span.textContent = text;
        line++;
        setTimeout(step, 0);
        return;
      }
      span.textContent += text[c++];
      if (c < text.length) { setTimeout(step, TYPE_DELAY); return; }
      line++;
      c = 0;
      setTimeout(step, COMPILE_DELAY);
    })();
  }

  function showAchievement() {
    const el = $("achievement");
    $("achievement-text").textContent = `${user} reached a new level`;
    el.hidden = false;
    setTimeout(() => el.classList.add("leaving"), 6000);
    setTimeout(() => { el.hidden = true; }, 6600);
  }

  // ---------- hero (Joker) ----------
  const jokerLines = [
    "Ну, чё, народ, погнали?!",
    "Holy fuckin shit!",
    "Wanna know how I made it this far?",
    "Ты когда-нибудь танцевал с дьяволом под Бонни Тайлер?"
  ];
  const joker = $("joker");
  const bubble = $("joker-bubble");
  let jokerLine = 0;
  $("joker-img").src = cfg.hero.img;
  $("joker-img").alt = cfg.hero.alt;

  function say(text) {
    bubble.textContent = text;
    bubble.classList.remove("show");
    void bubble.offsetWidth; // restart the pop animation
    bubble.classList.add("show");
  }

  function showJoker() {
    joker.classList.add("show");
    setTimeout(() => say(jokerLines[0]), 700);
  }

  joker.addEventListener("click", () => {
    if (!joker.classList.contains("show")) return;
    jokerLine = (jokerLine + 1) % jokerLines.length;
    say(jokerLines[jokerLine]);
    burst(80);
  });

  // ---------- crew on the grid ----------
  // Each friend is built twice: standing on the grid (big screens)
  // and in a row inside the card (small screens). CSS shows one of them.
  function makeMate(mate, i, left) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `mate ${left ? "mate-left" : "mate-right"}`;
    el.setAttribute("aria-label", `${mate.name || mate.type}: show wish`);
    el.style.setProperty("--flip", mate.flip ? -1 : 1);
    el.style.setProperty("--delay", `${0.3 + i * 0.2}s`);
    const img = document.createElement("img");
    img.src = mate.img;
    img.alt = mate.alt || `${mate.name} (${mate.type})`;
    const tag = document.createElement("span");
    tag.className = "mate-tag";
    tag.textContent = mate.name ? `${mate.name} · ${mate.type}` : mate.type;
    const matebubble = document.createElement("span");
    matebubble.className = "bubble";
    el.append(matebubble, img, tag);

    el.addEventListener("click", () => {
      document.querySelectorAll(".mate.active").forEach((m) => m !== el && m.classList.remove("active"));
      el.classList.add("active", "grow");
      setTimeout(() => el.classList.remove("grow"), 300);
      matebubble.textContent = mate.wish || "Happy birthday!";
      matebubble.classList.remove("show");
      void matebubble.offsetWidth; // restart the pop animation
      matebubble.classList.add("show");
      clearTimeout(el.timer);
      el.timer = setTimeout(() => el.classList.remove("active"), 3500);
    });
    return el;
  }

  // Slots from the screen edge inward: the outer one is closer, so it is bigger
  const crewEl = $("crew");
  const crewRow = $("crew-row");
  const half = Math.ceil(cfg.crew.length / 2);
  cfg.crew.forEach((mate, i) => {
    const left = i < half;
    const depth = left ? half - 1 - i : i - half; // 0 = next to the edge
    const onGrid = makeMate(mate, i, left);
    onGrid.style.setProperty(left ? "left" : "right", `${2 + depth * 11}%`);
    onGrid.style.setProperty("--depth", depth);
    // inner friends stand near the card, so their bubble opens toward the screen edge
    if (depth > 0) onGrid.classList.add("bubble-out");
    crewEl.append(onGrid);
    crewRow.append(makeMate(mate, i, left));
  });

  // ---------- gift card game ----------
  const game = cfg.giftCards;
  const cardsEl = $("gift-cards");
  const hint = $("gift-hint");
  let shuffled = false;
  let busy = false; // ignore clicks while cards flip or move
  let missCount = 0;
  let found = false;

  function makeCard(isPrize) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gift";
    card.setAttribute("aria-label", "Face-down card");
    card.innerHTML =
      '<span class="gift-inner">' +
      '<span class="gift-face gift-back" aria-hidden="true"></span>' +
      '<span class="gift-face gift-front"></span>' +
      "</span>";
    card.isPrize = isPrize;
    card.addEventListener("click", () => openCard(card));
    return card;
  }

  const cards = [makeCard(false), makeCard(false), makeCard(true)];
  cardsEl.append(...cards);

  function flip(card, html) {
    card.querySelector(".gift-front").innerHTML = html;
    card.classList.add("open");
    card.setAttribute("aria-label", card.querySelector(".gift-front").textContent);
  }

  // an open card flips back face down on the next click
  function closeCard(card) {
    card.classList.remove("open");
    card.setAttribute("aria-label", "Face-down card");
  }

  // the gift's spoiler: first click on the open gift card reveals it, the next one flips the card
  function revealSpoiler(card) {
    card.querySelector(".spoiler").classList.add("revealed");
    card.setAttribute("aria-label", `${game.prize.title} ${game.prize.text} ${game.prize.spoiler}`);
  }

  function openCard(card) {
    if (busy) return;
    if (card.classList.contains("open")) {
      const spoiler = card.querySelector(".spoiler:not(.revealed)");
      if (spoiler) revealSpoiler(card);
      else closeCard(card);
      return;
    }

    if (!card.isPrize) {
      flip(card, `<span class="gift-text">${game.misses[missCount++ % game.misses.length]}</span>`);
      return;
    }

    if (shuffled) {
      const wasRevealed = !!card.querySelector(".spoiler.revealed");
      const spoiler = game.prize.spoiler
        ? `<span class="gift-text spoiler${wasRevealed ? " revealed" : ""}">${game.prize.spoiler}</span>`
        : "";
      flip(card, `<span class="gift-title">${game.prize.title}</span><span class="gift-text">${game.prize.text}</span>${spoiler}`);
      card.classList.add("prize");
      // keep the hidden text out of the screen-reader label until it is revealed
      if (game.prize.spoiler && !wasRevealed) {
        card.setAttribute("aria-label", `${game.prize.title} ${game.prize.text} Hidden message, press to reveal`);
      }
      hint.textContent = game.found;
      if (!found) burst(150); // confetti only the first time the gift is found
      found = true;
      return;
    }

    // first try on the gift card: it escapes, everything is reshuffled once
    shuffled = true;
    busy = true;
    hint.textContent = game.escape;
    card.classList.add("escape");
    setTimeout(() => {
      card.classList.remove("escape");
      cards.forEach(closeCard);
    }, 500);
    setTimeout(() => shuffle(5, () => {
      busy = false;
      hint.textContent = game.retry;
    }), 1200);
  }

  // Swap cards several times; positions animate with the FLIP technique:
  // remember where each card was, reorder the DOM, then slide from old to new place
  function shuffle(steps, done) {
    if (steps === 0) { done(); return; }
    const before = new Map(cards.map((c) => [c, c.getBoundingClientRect().left]));
    const order = [...cardsEl.children];
    const i = Math.floor(Math.random() * order.length);
    const j = (i + 1 + Math.floor(Math.random() * (order.length - 1))) % order.length;
    [order[i], order[j]] = [order[j], order[i]];
    cardsEl.append(...order);
    cards.forEach((c) => {
      const dx = before.get(c) - c.getBoundingClientRect().left;
      c.style.transition = "none";
      c.style.translate = `${dx}px 0`;
    });
    void cardsEl.offsetWidth;
    cards.forEach((c) => {
      c.style.transition = "";
      c.style.translate = "";
    });
    setTimeout(() => shuffle(steps - 1, done), 380);
  }

  // ---------- music ----------
  // Local file first; if it is missing, fall back to a hidden YouTube player.
  const musicBtn = $("music-btn");
  let player = null; // { play(), pause() }
  let playing = false;

  function setPlaying(value) {
    playing = value;
    musicBtn.classList.toggle("playing", value);
    musicBtn.classList.toggle("paused", !value);
    musicBtn.setAttribute("aria-label", value ? "Pause music" : "Play music");
  }

  function startLocal() {
    return new Promise((resolve, reject) => {
      const audio = new Audio(cfg.music.file);
      audio.loop = true;
      audio.currentTime = cfg.music.startAt || 0;
      audio.addEventListener("error", reject, { once: true });
      // play() must be called synchronously inside the click handler
      audio.play().then(() => {
        player = { play: () => audio.play(), pause: () => audio.pause() };
        resolve();
      }, reject);
    });
  }

  function startYouTube() {
    if (!cfg.music.youtubeId) return;
    window.onYouTubeIframeAPIReady = () => {
      const yt = new YT.Player("yt-player", {
        width: 1,
        height: 1,
        videoId: cfg.music.youtubeId,
        playerVars: {
          autoplay: 1,
          start: cfg.music.startAt || 0,
          loop: 1,
          playlist: cfg.music.youtubeId,
          playsinline: 1,
          controls: 0
        },
        events: {
          onReady: (e) => { e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
          }
        }
      });
      player = { play: () => yt.playVideo(), pause: () => yt.pauseVideo() };
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.append(tag);
  }
  function startMusic() {
    musicBtn.hidden = false;
    setPlaying(false);
    // the mp3 is not published (see .gitignore), so on GitHub Pages this falls back to YouTube
    startLocal().then(() => setPlaying(true), startYouTube);
  }

  musicBtn.addEventListener("click", () => {
    if (!player) return;
    if (playing) { player.pause(); setPlaying(false); }
    else { player.play(); setPlaying(true); }
  });

  // ---------- confetti ----------
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#ff3cac", "#2de2e6", "#ffd319", "#ffffff", "#b967ff"];
  let pieces = [];
  let rafId = null;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener("resize", resize);
  resize();

  function burst(count) {
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * innerWidth,
        y: -20 - Math.random() * innerHeight * 0.5,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        vx: -1.5 + Math.random() * 3,
        vy: 2 + Math.random() * 3,
        rot: Math.random() * Math.PI,
        vr: -0.15 + Math.random() * 0.3,
        color: colors[(Math.random() * colors.length) | 0]
      });
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces = pieces.filter((p) => p.y < innerHeight + 30);
    for (const p of pieces) {
      p.x += p.vx + Math.sin(p.y / 40);
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.rot * 2));
      ctx.restore();
    }
    rafId = pieces.length ? requestAnimationFrame(tick) : null;
  }

  $("confetti-btn").addEventListener("click", () => burst(150));

  // ---------- open ----------
  $("open-btn").addEventListener("click", () => {
    startMusic();
    const intro = $("intro");
    // samurai turn to face the viewer first, then the intro fades out
    intro.classList.add("turning");
    setTimeout(() => intro.classList.add("leaving"), 1100);
    setTimeout(() => {
      intro.hidden = true;
      $("card").hidden = false;
      window.scrollTo(0, 0);
      burst(220);
      $("crew").hidden = false;
      setTimeout(() => typeTerminal(() => { showJoker(); showAchievement(); }), 900);
    }, 1700);
  }, { once: true });
})();
