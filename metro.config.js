const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle size optimizations
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Tree shaking for better bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Optimize asset handling
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'jpeg', 'gif', 'svg');

// Exclude unnecessary files from bundle
config.resolver.blockList = [
  /.*\/node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\/__tests__\/.*/,
  /.*\/\.git\/.*/,
  /.*\/\.vscode\/.*/,
];

// Enable Hermes for better performance
config.transformer.enableHermes = true;

module.exports = config;
