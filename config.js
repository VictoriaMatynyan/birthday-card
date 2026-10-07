window.CARD_CONFIG = {
  friendName: "SERGEY JAN!",
  from: "Victoria jan and Artyom jan",

  message:
    "We wish you a lot of cool and adventerous stories you'll be a hero of " +
    "and lots of adventures, laughter and everything you've been holding out for.",

  // Card game: three face-down cards. The right one hides the gift, but the first
  // time it is clicked it escapes and all cards get shuffled once. After that
  // the gift card opens as soon as it is found.
  giftCards: {
    misses: ["Good job! …but it's empty", "Have another try", "Nope, not this one"],
    escape: "Almost caught it! Shuffling…",
    retry: "Now find it again!",
    prize: { title: "Your gift🎁", text: "Special code:", spoiler: "We got the gift! See you on Sat 😈" },
    found: "You found it! 🎉"
  },

  hero: {
    img: "assets/img/analysts_ENTP_the_joker.svg",
    type: "ENTP",
    alt: "The birthday hero as a low-poly Joker: green hair, wide red grin, purple suit and a playing card in hand"
  },

  // flip: true mirrors the figure so it faces the center.
  crew: [
    { name: "Victoria", type: "ENTP", img: "assets/img/ENTP_celine_dion.svg", alt: "a low-poly Celine Dion in a purple sequin dress, singing into a microphone", flip: true,
      wish: "Show must go on... and on!" },
    { name: "Artyom", type: "INTJ", img: "assets/img/analysts_INTJ_christopher_nolan.svg", alt: "a low-poly Christopher Nolan in a long coat, pointing ahead next to a film camera", flip: true,
      wish: "Рафаэлки не кончаются, либо во сне, либо в День рождения!" },
    { name: "Helena", type: "ENFP", img: "assets/img/diplomats_ENFP_robert_downey_jr.svg", alt: "a low-poly Robert Downey Jr. in a green suit and tinted glasses, holding an Iron Man helmet", flip: true,
      wish: "Извините, Аркхам сегодня закрыт!" },
    { name: "Alexey", type: "INFJ", img: "assets/img/diplomats_INFJ_goethe.svg", alt: "a low-poly Goethe with grey curls and a green coat, holding a quill and a book",
      wish: "Идей острее крылышек, а слов - быстрее пёрышек!" }
  ],

  music: {
    file: "assets/music/holding-out-for-a-hero.mp3",
    // fallback if the file is missing: YouTube video id
    youtubeId: "bWcASV2sey0",
    // start the song from this second
    startAt: 1
  }
};
