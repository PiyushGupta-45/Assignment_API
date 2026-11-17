const baseConfig = require('./app.json');

// Only the public Worker URL is exposed to the app. Provider credentials remain
// encrypted Worker secrets and are never placed into the mobile bundle.
module.exports = () => ({
  ...baseConfig.expo,
  extra: {
    ...(baseConfig.expo.extra || {}),
    songApiUrl: process.env.EXPO_PUBLIC_SONG_API_URL || '',
  },
});
