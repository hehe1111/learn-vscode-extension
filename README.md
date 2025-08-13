# Learn VSCode Extension

一个用于学习 VSCode 扩展开发的示例项目，支持通过命令面板和右键菜单调用功能。

## 安装依赖

包管理器使用 `yarn`。不要使用 `pnpm`。

## 打包

```bash
# 全局安装 vsce
npm i -g vsce
# 打包
yarn package
```

## 安装生成的 `.vsix` 文件

```bash
code --install-extension learn-vscode-extension-0.0.1.vsix
```

或者在 vscode 中按 `Ctrl + Shift + P` 调出命令面板，选中 `Extension: Install from VSIX...`，选中构建出的 `learn-vscode-extension-0.0.1.vsix`，安装

## 使用

在 vscode 中打开一个 JSON 文件，鼠标右键，选择「在浏览器中编辑 JSON」菜单项。
