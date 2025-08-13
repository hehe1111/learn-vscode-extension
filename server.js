const fs = require('node:fs')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const chokidar = require('chokidar')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})
const port = 8080

// 从命令行参数获取 JSON 文件路径
const jsonFilePath = process.argv[2]
let jsonContent = ''

if (jsonFilePath) {
  try {
    jsonContent = fs.readFileSync(jsonFilePath, 'utf8')
  } catch (error) {
    jsonContent = JSON.stringify({ error: '无法读取JSON文件: ' + error.message })
  }
} else {
  jsonContent = JSON.stringify({ message: '未指定JSON文件' })
}

app.engine('.html', require('ejs').__express)
app.set('views', process.cwd())
app.set('view engine', 'html')

// 设置路由，使用 ejs 渲染模板
app.get('/', (req, res) => {
  res.render('index', { jsonContent })
})

// 静态文件服务
app.use(express.static(process.cwd()))

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('客户端已连接:', socket.id)
  
  // 发送当前文件内容给新连接的客户端
  socket.emit('file-content', jsonContent)
  
  // 监听客户端保存文件请求
  socket.on('save-file', (content) => {
    if (!jsonFilePath) {
      socket.emit('save-error', '未指定JSON文件路径')
      return
    }
    
    try {
      fs.writeFileSync(jsonFilePath, content, 'utf8')
      jsonContent = content
      socket.emit('save-success')
      
      // 广播给所有客户端文件已更新
      io.emit('file-updated', content)
    } catch (error) {
      socket.emit('save-error', error.message)
    }
  })
  
  // 断开连接处理
  socket.on('disconnect', () => {
    console.log('客户端已断开连接:', socket.id)
  })
})

// 文件监控
if (jsonFilePath) {
  const watcher = chokidar.watch(jsonFilePath, {
    persistent: true,
    ignoreInitial: true
  })
  
  watcher.on('change', () => {
    console.log('检测到文件变化:', jsonFilePath)
    try {
      const newContent = fs.readFileSync(jsonFilePath, 'utf8')
      if (newContent !== jsonContent) {
        jsonContent = newContent
        // 广播文件变化给所有连接的客户端
        io.emit('file-changed', newContent)
      }
    } catch (error) {
      console.error('读取文件失败:', error)
      io.emit('file-error', error.message)
    }
  })
  
  console.log('正在监控文件变化:', jsonFilePath)
}

// 启动服务器，检查端口占用情况
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`错误：端口 ${port} 已被占用！`)
    console.error('请关闭占用该端口的服务或更换端口后重试。')
    process.exit(1) // 直接终止进程
  } else {
    console.error('服务器启动失败:', error.message)
    process.exit(1)
  }
})

server.listen(port, () => {
  console.log(`Express服务器已启动，访问 http://localhost:${port} 查看内容`)
  if (jsonFilePath) {
    console.log(`正在编辑文件: ${jsonFilePath}`)
  }
})
