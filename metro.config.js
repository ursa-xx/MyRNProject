const { getDefaultConfig } = require('expo/metro-config');

/**
 * Expo 裸工作流：使用 Expo 的 Metro 配置，提供 .expo/.virtual-metro-entry 等入口
 */
const config = getDefaultConfig(__dirname);

module.exports = config;
