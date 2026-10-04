# Birthday card 🎂

Открытка в стиле 80-х (synthwave) под «Holding Out For A Hero».

## Локальный запуск

```bash
cd ~/Documents/Dev/birthday-card
python3 -m http.server 8000
```

Открыть http://localhost:8000

## Что поменять

Всё в `config.js`: имя друга, подпись, текст поздравления, пожелания от друзей.

## Музыка

- Положи mp3 в `assets/music/holding-out-for-a-hero.mp3` — он будет играть локально.
  Файл в `.gitignore`, на GitHub не попадёт (трек защищён авторским правом).
- Если файла нет (например, на GitHub Pages), играет скрытый плеер YouTube
  (`music.youtubeId` в `config.js`).
- Музыка стартует по клику «Open the card»: браузеры не дают играть звук без действия пользователя.

## Публикация на GitHub Pages

```bash
git remote add origin git@github.com:<user>/birthday-card.git
git push -u origin main
```

Потом в репозитории: Settings → Pages → Deploy from a branch → `main` / `(root)`.
