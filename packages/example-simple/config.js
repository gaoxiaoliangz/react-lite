module.exports = {
  webpack: {
    development: config => config,
    production: config => config,
    devServer: (config, proxy, allowedHost) => config,
  },
};
