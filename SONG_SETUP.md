# NameTune: Groq Lyrics + BlueMetal Song Flow

The app sends only a name and language to the existing secure JavaScript backend (Cloudflare Worker). No lyrics, name, audio, history, or metadata is saved in Firebase, MongoDB, or any other database.

## Server-side sequence

1. The Worker asks Groq for exactly six personalized lyric lines.
2. It returns those same six lines to the app for display.
3. Without changing the lines, the Worker inserts the same text into the BlueMetal song prompt.
4. BlueMetal creates an asynchronous MP3 task.
5. The app polls the Worker and receives BlueMetal's temporary MP3 URL when ready.

## Required Worker secrets

From the `worker` directory, configure secrets only if they are not already present:

```powershell
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put BLUEMETAL_API_KEY
npx wrangler deploy
```

Never put either key in the app `.env`, `App.js`, or an Expo public variable.

## App configuration

The app only needs the public Worker URL:

```text
EXPO_PUBLIC_SONG_API_URL=https://nametune-song-ai.your-account.workers.dev
```

After changing Worker code, run `npx wrangler deploy` from `worker`. The Expo app only needs a reload because the Worker URL itself has not changed.
