module.exports = {
  webpack(config, options) {
    config.resolve.extensions = ['.ts', '.tsx', ...config.resolve.extensions];
    return config;
  },
};
