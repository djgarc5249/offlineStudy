# Cert Drill

Offline study app for Security+, CCNA, Linux+, CySA+ and Network+. Static PWA: no build step, no backend, no accounts. Progress is saved on the device (localStorage).

## Deploy (GitHub Pages, free)
1. Create a new GitHub repo (e.g. `cert-drill`) and push these files to `main`.
2. Repo Settings > Pages > Deploy from branch > `main` / root.
3. Wait a minute, then open `https://<your-username>.github.io/cert-drill/` in **Safari** on the iPhone.
4. Share button > **Add to Home Screen**.
5. Open it once from the home-screen icon while online (this caches everything). Then turn on airplane mode and confirm it still opens. The status line should say "Offline ready".

## Updating
Edit a pack in `packs/`, then bump `CACHE` in `sw.js` (`certdrill-v1` -> `v2`) so phones pick up the new files.

## Layout
- `app.js` engine, `subnet.js` generated subnetting drills, `sw.js` offline cache
- `packs/*.js` one file per cert (questions, flashcards, reference tables)

Questions are original practice items, not exam dumps. Confirm exam versions and dates on the vendor sites.
