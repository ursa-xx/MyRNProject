# Expo 裸工作流说明

## 已完成的配置

当前项目已按 **Expo 裸工作流（Bare Workflow）** 配置好 JS 侧：

1. **依赖**
   - `expo`、`expo-constants`、`expo-status-bar`、`babel-preset-expo` 已加入 `package.json`。
   - `npm start` 已改为使用 `expo start`；如需原 Metro：`npm run start:rn`。

2. **配置**
   - **app.json**：增加 `expo` 段（name、slug、version、ios/android 等）。
   - **app.config.js**：供 Expo CLI 读取的配置（与 app.json 中 expo 一致）。
   - **babel.config.js**：已改为使用 `babel-preset-expo`。

3. **入口**
   - 仍使用 `index.js` + `AppRegistry.registerComponent`，无需改动。

---

## 如何生成/更新原生裸工程（ios / android）

Expo 裸工作流需要由 **Expo Prebuild** 生成或更新原生目录。在本机终端执行（建议在项目根目录）：

```bash
cd /Users/usea/conpany1/MyRNProject
npx expo prebuild --clean
```

- **若出现 SSL 证书错误**：和之前 pod install 一样，先设证书再执行：
  ```bash
  export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
  export SSL_CERT_FILE=/Users/usea/conpany1/MyRNProject/MyRNProject/ios/.macos-certs.pem
  cd /Users/usea/conpany1/MyRNProject
  npx expo prebuild --clean
  ```
  若证书文件不在上述路径，可用之前「运行前必读」里从钥匙串导出证书的方式生成一个，再设 `SSL_CERT_FILE` 指向该文件。

- **prebuild 成功后**：
  - 会在项目根目录生成 **ios/** 和 **android/**（带 Expo 模块）。
  - 之后需要把 **react-native.config.js** 里 `sourceDir` 改为根目录的 `./ios` 和 `./android`（或删掉自定义 `sourceDir`，使用默认），这样 `npm run ios` / `npm run android` 会使用新的裸工程。

---

## 当前可用的命令

| 命令 | 说明 |
|------|------|
| `npm start` | 使用 **Expo** 启动开发服务器（`expo start`） |
| `npm run start:rn` | 使用原 **React Native** Metro 启动 |
| `npm run ios` | 跑 iOS（当前仍指向子目录里的 ios 工程） |
| `npm run android` | 跑 Android |
| `npm run prebuild` | 执行 `expo prebuild`，生成/更新裸工程 |

---

## 两种使用方式

1. **继续用现有原生工程**  
   不跑 prebuild，继续用当前 `MyRNProject/MyRNProject/ios` 和 `android`，只享受 Expo 的 JS 生态（expo start、expo 包等）。  
   - 注意：现有 ios/android 里没有 Expo 原生模块，部分 expo 包可能不可用，直到用 prebuild 生成带 Expo 的原生工程。

2. **完整 Expo 裸工作流**  
   在本机终端成功执行一次 `npx expo prebuild --clean`（必要时加 SSL 证书环境变量），用生成的根目录 **ios/** 和 **android/**，并更新 `react-native.config.js` 指向它们，即可得到完整的 Expo 裸工作流。
