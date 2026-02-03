/**
 * Expo prebuild 后 ios/android 在项目根目录，指向根目录的 ios 和 android
 */
module.exports = {
  project: {
    ios: {
      sourceDir: './ios',
    },
    android: {
      sourceDir: './android',
    },
  },
};
