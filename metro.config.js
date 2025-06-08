const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Resolver para problemas de module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json', 'svg');

// Reset cache automaticamente em desenvolvimento
config.resetCache = true;

module.exports = config; 