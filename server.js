const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 8080

// 读取HTML文件
const htmlPath = path.join(__dirname, 'index.html')
const htmlContent = fs.readFileSync(htmlPath, 'utf8')

// 设置路由
app.get('/', (req, res) => {
  res.send(htmlContent)
})

// 启动服务器
app.listen(port, () => {
  console.log(`Express服务器已启动，访问 http://localhost:${port} 查看内容`)
})
