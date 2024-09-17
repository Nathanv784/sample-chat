// config-overrides.js

const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "http": require.resolve("stream-http"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "querystring": require.resolve("querystring-es3"),
    "timers": require.resolve("timers-browserify"),
    "fs": false,  // Not available in the browser
    "net": false, // Not available in the browser
    "tls": false, // Not available in the browser
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);

  return config;
};
