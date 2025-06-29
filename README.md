# Learn VSCode Extension

一个用于学习 VSCode 扩展开发的示例项目，支持通过命令面板和右键菜单调用功能。

## 功能特性

- 🎯 **命令面板支持**: 通过 `Ctrl+Shift+P` 调用 `learn-vscode` 命令
- 🖱️ **右键菜单支持**: 在编辑器中右键点击，选择 `learn-vscode` 命令
- 💬 **用户输入**: 显示输入框让用户输入内容
- 🔔 **全局通知**: 显示用户输入的内容作为通知

## 安装方法

### 开发模式安装

1. 克隆或下载此项目到本地
2. 打开 VSCode
3. 按 `F5` 键或使用 `运行和调试` 面板启动扩展开发宿主
4. 在新打开的 VSCode 窗口中，扩展将自动激活

### 打包安装

1. 确保已安装 `vsce` 工具：

   ```bash
   pnpm install -g vsce
   ```

2. 在项目根目录下运行：

   ```bash
   vsce package
   ```

3. 安装生成的 `.vsix` 文件：
   ```bash
   code --install-extension learn-vscode-extension-0.0.1.vsix
   ```

## 使用方法

### 方法一：通过命令面板

1. 按 `Ctrl+Shift+P` 打开命令面板
2. 输入 `learn-vscode` 并回车
3. 在弹出的输入框中输入内容
4. 按回车确认
5. 查看全局通知消息

### 方法二：通过右键菜单

1. 在任意编辑器中右键点击
2. 选择 `learn-vscode` 菜单项
3. 在顶部弹出的输入框中输入内容
4. 按回车确认
5. 查看全局通知消息

## 项目结构

```
learn-vscode-extension/
├── package.json          # 扩展清单文件
├── extension.js          # 主要功能代码
└── README.md            # 使用说明文档
```

## 开发说明

### 主要文件说明

- **package.json**: 定义了扩展的基本信息、命令、菜单贡献点等
- **extension.js**: 包含扩展的主要逻辑，包括命令注册和事件处理

### 核心功能实现

1. **命令注册**: 在 `activate` 函数中注册两个命令
2. **输入处理**: 使用 `vscode.window.showInputBox` 显示输入框
3. **通知显示**: 使用 `vscode.window.showInformationMessage` 显示通知

## 调试和开发

1. 打开项目目录
2. 按 `F5` 启动调试
3. 在新的 VSCode 窗口中测试扩展功能
4. 查看调试控制台获取日志信息

## 注意事项

- 确保 VSCode 版本 >= 1.74.0
- 输入框支持取消操作（ESC 键或点击取消）
- 空输入会显示警告提示
- 扩展激活时会显示成功提示

## 版本历史

- **0.0.1**: 初始版本，支持命令面板和右键菜单功能

## 许可证

MIT License
