const axios = require('axios');
const fs = require('fs');
const config = require('../config')

/**
 * 可能状态码 
 * 524 服务器超时
 */
const retryCodeList = [524]
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

/**
 * @params
 * @url 图片地址
 * @path 输出文件地址
 * @filename 输出文件名
 * @retryLeft 重试次数
 * @return
 * @Promise
 * @resolve 
 * @reject statusCode or createWriteStream error
 */
 const download_image = (url, path, filename, retryLeft) => {
  return fetchData(
    url,
    {responseType: 'stream',}
  ).then(
    response => {
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(path + filename))
          .on('finish', () => {
            resolve(1)
          })
          .on('error', e => reject(e));
      })
    },
    error => {
      if(handlerError(error, url, retryLeft)) {
        download_image(url, path, filename, retryLeft - 1)
      }
    }
  )
}

function fetchData(url, opt) {
  return axios({
    url,
    headers: {
      cookie: config.cookie,
      referer: config.referer
    },
    ...opt
  })
}

/**
 * @return
 * @true 应当继续重试
 * @false 失败，停止重试
 */
function handlerError(error, url, retryLeft) {
  const response = error.response
  if(retryLeft <= 1){
    console.log(`失败：${url}`)
    return false
  }
  if(response && response.status){ 
    const statusCode = response.status
    console.log(`失败状态码：${statusCode} 失败信息:${response.statusText} 剩余重试次数：${retryLeft}`)
    if(retryCodeList.indexOf(statusCode)){
      return true
    }
  }
  if(error.code === 'ECONNRESET' || 'ETIMEDOUT'){
    console.log(`失败信息:${error.code} 剩余重试次数：${retryLeft}`)
    return true
  }
  console.log('未知失败：', url)
  return false
}

module.exports = {download_image, fetchData, handlerError}