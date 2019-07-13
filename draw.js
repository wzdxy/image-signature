const { createCanvas, loadImage } = require('canvas')

function drawList (list) {
  return new Promise((resolve, reject) => {
    // 创建画布
    const canvas = createCanvas(400, (list.length + 1) * 25)
    const ctx = canvas.getContext('2d')
    // 填充白色做为背景色
    ctx.rect(0,0, 600, (list.length + 1) * 80)
    ctx.fillStyle='white'
    ctx.fill()
    // 绘制文字, 每条文字一行
    ctx.font = '20px WenQuanYi Micro Hei'
    ctx.fillStyle = 'black'
    list.forEach((item, idx) => {
      ctx.fillText(item, 20, (idx + 1) * 25)
    })
    // 返回图片数据
    var data = canvas.toDataURL()
    var base64Data = data.replace(/^data:image\/\w+;base64,/, '')
    var dataBuffer = Buffer.alloc(base64Data.length, base64Data, 'base64')
    resolve(dataBuffer)
  })
}
module.exports = {
  drawList
}
