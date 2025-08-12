const fs = require('node:fs')
const express = require('express')
const ejs = require('ejs')

const app = express()
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

app.engine('.html', ejs.__express)
app.set('views', process.cwd())
app.set('view engine', 'html')

// 设置路由，使用 ejs 渲染模板
app.get('/', (req, res) => {
  res.render('index', { jsonContent })
})

// 启动服务器
app.listen(port, () => {
  console.log(`Express服务器已启动，访问 http://localhost:${port} 查看内容`)
  if (jsonFilePath) {
    console.log(`正在编辑文件: ${jsonFilePath}`)
  }
})
