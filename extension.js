const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

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

  // 注册在浏览器中编辑命令
  let editInBrowserDisposable = vscode.commands.registerCommand(
    'learn-vscode-extension.editInBrowser',
    async (uri) => {
      try {
        // 检查文件扩展名
        const fileExtension = uri.fsPath.toLowerCase().split('.').pop()

        if (fileExtension === 'json') {
          // 如果是json文件，启动Express服务器并传递文件路径
          await startExpressServer(uri.fsPath)
        } else {
          // 如果不是json文件，显示警告提示
          vscode.window.showWarningMessage('这不是一个json文件')
        }
      } catch (error) {
        vscode.window.showErrorMessage(`处理文件时出错: ${error.message}`)
      }
    }
  )

  // 将命令添加到上下文中，以便在扩展停用时正确释放
  context.subscriptions.push(commandPaletteDisposable)
  context.subscriptions.push(contextMenuDisposable)
  context.subscriptions.push(editInBrowserDisposable)

  // 显示扩展激活成功的提示
  vscode.window.showInformationMessage(
    'learn-vscode-extension 扩展已成功激活！'
  )
}

/**
 * 查找可用端口
 * @param {number} startPort - 起始端口号
 * @returns {Promise<number>} - 返回可用端口号
 */
async function findAvailablePort(startPort) {
  const net = require('net')

  return new Promise((resolve, reject) => {
    let port = startPort

    const checkPort = () => {
      const client = net.createConnection({ port });

      client.on('connect', () => {
        // 能连接上，说明端口被占用了，需要 +1 继续找没被占用的端口
        client.end(); // 关闭连接
        port++
        if (port > 65535) {
          reject(new Error('没有找到可用的端口'))
        } else {
          checkPort()
        }
      });

      client.on('error', () => {
        // 连接失败，说明端口未被占用
        resolve(port)
      });
    }

    checkPort()
  })
}

/**
 * 启动Express服务器
 * @param {string} jsonFilePath - JSON文件路径
 */
async function startExpressServer(jsonFilePath) {
  try {
    // 查找可用端口，从8765开始
    const startPort = 8765
    const availablePort = await findAvailablePort(startPort)

    // 创建一个新的终端
    const terminal = vscode.window.createTerminal('Express Server')

    // 获取当前扩展的路径
    const extensionPath = path.dirname(__filename)

    // 在终端中启动 server.js，传递 JSON 文件路径和端口号作为参数
    terminal.sendText(`cd "${extensionPath}" && node server.js "${jsonFilePath}" ${availablePort}`)
    terminal.show()

    // 提示用户服务器正在启动
    vscode.window.showInformationMessage(`正在启动Express服务器，使用端口 ${availablePort}...`)

    // 等待服务器启动并检查是否成功
    const maxAttempts = 20
    let attempts = 0

    const checkServer = async () => {
      attempts++

      if (attempts >= maxAttempts) {
        vscode.window.showErrorMessage('服务器启动超时，请检查终端输出')
        return
      }

      try {
        // 使用 Node.js 内置 http 模块检查服务器状态
        const http = require('http')

        const options = {
          hostname: 'localhost',
          port: availablePort,
          path: '/',
          method: 'GET',
          timeout: 2000
        }

        const req = http.request(options, (res) => {
          if (res.statusCode === 200) {
            // 服务器已成功启动，打开浏览器
            vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${availablePort}`))
            vscode.window.showInformationMessage(`Express服务器已启动，正在打开浏览器访问 http://localhost:${availablePort}`)
          } else {
            // 状态码不是200，重试
            setTimeout(checkServer, 500)
          }
        })

        req.on('error', () => {
          // 服务器还未启动，重试
          setTimeout(checkServer, 500)
        })

        req.on('timeout', () => {
          req.destroy()
          setTimeout(checkServer, 500)
        })

        req.end()

      } catch (error) {
        // 检查失败，重试
        setTimeout(checkServer, 500)
      }
    }

    // 开始检查服务器状态
    setTimeout(checkServer, 1000)

  } catch (error) {
    vscode.window.showErrorMessage(`启动服务器失败: ${error.message}`)
  }
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
