// Everything you might want to change is in this file.
window.CARD_CONFIG = {
  friendName: "Alex",
  from: "Victoria",

  message:
    "Happy birthday to the one who always shows up when it matters. " +
    "You're the hero of so many of our stories — may this year be full of " +
    "adventures, laughter and everything you've been holding out for.",

  // Add wishes from other friends here. Each one becomes a card.
  wishes: [
    { from: "Victoria", text: "Stay as bright, brave and ridiculous as you are. Love you!" },
    { from: "A friend", text: "Wishing you a year of epic wins and zero boss fights." },
    { from: "Another friend", text: "Cake first, everything else later. Happy birthday!" }
  ],

  music: {
    // Local file (not published to GitHub, see .gitignore)
    file: "assets/music/holding-out-for-a-hero.mp3",
    // Fallback if the file is missing: YouTube video id
    youtubeId: "bWcASV2sey0",
    // Start the song from this second
    startAt: 0
  }
};
