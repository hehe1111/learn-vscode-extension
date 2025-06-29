const vscode = require('vscode')

/**
 * 显示输入框并处理用户输入
 * @param {string} source - 调用来源（用于区分命令面板或右键菜单）
 */
async function showInputAndNotify(source) {
  try {
    // 显示输入框
    const userInput = await vscode.window.showInputBox({
      prompt: `请输入内容 (来源: ${source})`,
      placeHolder: '在这里输入您的内容...',
      ignoreFocusOut: true
    })

    // 如果用户输入了内容（没有取消）
    if (userInput !== undefined && userInput.trim() !== '') {
      // 显示全局提示
      vscode.window.showInformationMessage(`您输入的内容是: ${userInput}`)
    } else if (userInput !== undefined) {
      // 用户输入了空内容
      vscode.window.showWarningMessage('您没有输入任何内容')
    }
    // 如果 userInput 是 undefined，说明用户取消了输入，不显示任何提示
  } catch (error) {
    vscode.window.showErrorMessage(`处理输入时出错: ${error.message}`)
  }
}

/**
 * 扩展激活时调用此函数
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('learn-vscode-extension 扩展已激活')

  // 注册命令面板命令 (Ctrl+Shift+P -> learn-vscode)
  let commandPaletteDisposable = vscode.commands.registerCommand(
    'learn-vscode-extension.showInputCommand',
    async () => {
      await showInputAndNotify('命令面板')
    }
  )

  // 注册右键菜单命令
  let contextMenuDisposable = vscode.commands.registerCommand(
    'learn-vscode-extension.showInputContextMenu',
    async () => {
      await showInputAndNotify('右键菜单')
    }
  )

  // 将命令添加到上下文中，以便在扩展停用时正确释放
  context.subscriptions.push(commandPaletteDisposable)
  context.subscriptions.push(contextMenuDisposable)

  // 显示扩展激活成功的提示
  vscode.window.showInformationMessage(
    'learn-vscode-extension 扩展已成功激活！'
  )
}

/**
 * 扩展停用时调用此函数
 */
function deactivate() {
  console.log('learn-vscode-extension 扩展已停用')
}

module.exports = {
  activate,
  deactivate
}
