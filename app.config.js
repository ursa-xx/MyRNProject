/**
 * Expo 配置（裸工作流）
 * 与 app.json 中的 expo 字段一致，便于 Expo CLI 读取
 */
module.exports = {
  expo: {
    name: 'MyRNProject',
    slug: 'my-rn-project',
    version: '0.0.1',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.myrnproject',
    },
    android: {
      package: 'com.myrnproject',
    },
    plugins: [],
    scheme: 'myrnproject',
  },
};
