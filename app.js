const Koa = require('koa')
const fs = require ('fs')
const axios = require('axios')
const Router = require('koa-router')
const browserDetect = require('browser-detect')
const draw = require('./draw.js')
const config = require('./config.js')
const app = new Koa();
let router = new Router()

router.get('/img', async (ctx, next) => {
  // IP
  let ip = ctx.request.header['x-real-ip'].match(/\d+.\d+.\d+.\d+/)
  let result, location, weather, browser
  // 城市定位
  if (ip) {
    try {
      result = await getLocation(ip[0])
      location = `${result.content.address_detail.province}${result.content.address_detail.city}`
      console.log(new Date(), location, ip[0])
    } catch (err) {
      console.error('获取失败', err)
      location = '未知'
    }
  }
  // 天气
  try {
    weather = await getWeather(result.content.address_detail.city)
  } catch (err) {
    weather = '未知'
  }
  // 浏览器
  let ua = ctx.request.header['user-agent']
  browser = getBrowser(ua)
  // 手机型号
  let mobile = getMobile(ua)
  // 时间
  let time = new Date().toLocaleString()
  // 根据以上信息绘制图片并返回
  ctx.res.writeHead(200)
  ctx.res.write(await draw.drawList ([
    `欢迎来自${location}的IT之家网友`,
    `您的IP是${ip[0]}`,
    `您的浏览器是 ${browser}`,
    `您的手机是 ${mobile}`,
    weather,
    `北京时间 ${time}`
    ]), 'binary')
  ctx.res.end()
});

app.use(router.routes()).use(router.allowedMethods())
app.listen(8000);

function getLocation(ip) {
  return new Promise((resolve, reject) => {
   axios.get('https://api.map.baidu.com/location/ip?ip='+ip+'&ak=' + config.baiduKey).then((res) => {
     if (res.data.status === 0) {
       resolve(res.data)
     } else {
       reject(res.data)
     }
   })
  })
}

function getWeather(location) {
  return new Promise((resolve, reject) => {
    axios.get('https://free-api.heweather.com/s6/weather/now?location='+ encodeURIComponent(location) +'&key=' + config.heKey).then((res) => {
      if (res.data.HeWeather6 && res.data.HeWeather6[0].status === 'ok') {
         let data = res.data.HeWeather6[0].now
         resolve(`您所在地的天气: ${data.cond_txt} 体感温度${data.fl}`)
      } else {
         console.error(res)
         reject('获取天气数据失败')
      }
    })

  })
}

function getBrowser(ua) {
  let result
  if(ua.includes('ithome')) {
    result = 'IT之家客户端'
  } else if (ua.includes('MicroMessenger')) {
    result = '微信'
  } else {
    result = browserDetect(ua).name
  }
  console.log(ua, result)
  return result
}

function getMobile(ua) {
  let result
  ua = ua.toUpperCase()
  if (ua.includes('NOKIA')) {
    result = '高贵的 Nokia'
  } else if (ua.includes('MICROSOFT')) {
    result = '高贵的 Microsoft'
  } else if (ua.includes('MEIZU')){
    result = '高贵的 魅族手机'
  } else if (ua.includes('HUAWEI')) {
    result = '高贵的 华为手机'
  } else if (ua.includes('WINDOWS PHONE')) {
    result = 'WindowsPhone 设备'
  } else if (ua.includes('IPHONE') || ua.includes('IPAD')) {
    result = '苹果设备'
  } else if (ua.includes('ANDROID')) {
    result = '安卓设备'
  } else {
    result = '火星牌手机'
  }
  return result
}