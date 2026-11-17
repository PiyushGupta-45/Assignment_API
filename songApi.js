import Constants from 'expo-constants';

const appExtra = Constants.expoConfig?.extra || {};
const SONG_API_URL = (process.env.EXPO_PUBLIC_SONG_API_URL || appExtra.songApiUrl || '').replace(/\/$/, '');

function getErrorMessage(payload, fallback) {
  return payload?.error?.message || payload?.error || payload?.message || fallback;
}

async function request(path, options = {}) {
  if (!SONG_API_URL) {
    throw new Error('Song service is not configured. Add EXPO_PUBLIC_SONG_API_URL and deploy the Worker.');
  }
  const response = await fetch(`${SONG_API_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, 'Song service request failed.'));
    error.lyrics = Array.isArray(payload.lines) ? payload.lines : [];
    throw error;
  }
  return payload;
}

// No API secret is sent from the app. The Worker calls Groq and BlueMetal.
export function createSong({ name, language }) {
  return request('/song', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, language }),
  }).then((payload) => {
    if (!Array.isArray(payload.lines) || payload.lines.length !== 6 || !payload.taskId) {
      throw new Error('The server returned an invalid song response. Deploy the latest Worker and try again.');
    }
    return payload;
  });
}

export function getSongTask(taskId) {
  return request(`/song/${encodeURIComponent(taskId)}`);
}
