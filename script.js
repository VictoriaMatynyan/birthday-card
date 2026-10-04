(function () {
  const cfg = window.CARD_CONFIG;
  const $ = (id) => document.getElementById(id);

  // ---------- content ----------
  document.title = `Happy Birthday, ${cfg.friendName}!`;
  $("friend-name").textContent = cfg.friendName;
  $("message").textContent = cfg.message;
  $("from").textContent = cfg.from;

  const wishesEl = $("wishes");
  cfg.wishes.forEach((wish, i) => {
    const fig = document.createElement("figure");
    fig.className = "wish";
    fig.style.setProperty("--tilt", `${(i % 2 ? 1 : -1) * (1 + (i % 3))}deg`);
    fig.style.animationDelay = `${0.6 + i * 0.12}s`;
    const quote = document.createElement("blockquote");
    quote.textContent = wish.text;
    const caption = document.createElement("figcaption");
    caption.textContent = `— ${wish.from}`;
    fig.append(quote, caption);
    wishesEl.append(fig);
  });

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
    intro.classList.add("leaving");
    setTimeout(() => {
      intro.hidden = true;
      $("card").hidden = false;
      window.scrollTo(0, 0);
      burst(220);
    }, 600);
  }, { once: true });
})();
