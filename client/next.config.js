// Hot reload for Next.js
module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};