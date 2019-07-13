## 生成签名图片

## HOW TO RUN
### 创建 config.js 文件

```js
module.exports = {
  baiduKey: '百度地图 API KEY 需支持IP定位',
  heKey: '和风天气 API KEY 需支持实时天气'
}
```
### 运行
```
npm i
pm2 start app
```

### 注意
如果服务器不支持中文字体需自行安装, 此处使用 `WenQuanYi Micro Hei`