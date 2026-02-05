const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * 继承 @react-native/metro-config，入口已改为 index（见 ios AppDelegate）
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
