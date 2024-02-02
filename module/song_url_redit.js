const request = require('request') // 或者 const axios = require('axios')

module.exports = async (query, request) => {
  query.cookie.os = 'android'
  query.cookie.appver = '8.10.05'
  const data = {
    ids: '[' + query.id + ']',
    level: query.level,
    encodeType: 'flac',
  }
  if (data.level == 'sky') {
    data.immerseType = 'c51'
  }

  // 发送POST请求
  const response = await request(
    'POST',
    `https://interface.music.163.com/eapi/song/enhance/player/url/v1`,
    data,
    {
      crypto: 'eapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
      url: '/api/song/enhance/player/url/v1',
    },
  )

  // 从响应中获取URL
  const url = response.data[0].url

  // 使用request库进行重定向
  const redirectResponse = await new Promise((resolve, reject) => {
    request(url, (error, redirectResponse) => {
      if (error) {
        reject(error)
      } else {
        resolve(redirectResponse)
      }
    })
  })

  // 获取最终重定向后的URL
  const redirectedUrl = redirectResponse.request.uri.href

  // 将重定向后的URL添加到原始数据中
  response.data[0].redirectedUrl = redirectedUrl

  // 返回修改后的响应数据
  return response
}
