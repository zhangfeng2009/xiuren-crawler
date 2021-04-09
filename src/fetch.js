const axios = require('axios');
const fs = require('fs');

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
      // console.log('response', response)
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(path + filename))
          .on('finish', () => {
            // console.log('下载成功：', filename)
            resolve(1)
          })
          .on('error', e => reject(e));
      })
    },
    error => {
      console.log('下载失败：', filename)
      const response = error.response
      if(response && response.status){
        /**
         * 可能状态码 524 服务器超时
         */
        console.log(`失败状态码：${response.status} 失败信息:${response.statusText} 剩余重试次数：${retryLeft}`, )

        if(retryLeft < 1){
          return download_image(url, path, filename, retryLeft - 1)
        }else{
          return response.status
        }
      }
      console.log('未知错误：', error)
      return error
    }
  )
}

function fetchData(url, opt) {
  // make http call to url
  return axios({
    url,
    // withCredentials: true,
    headers: {
      cookie: '__cfduid=dd807ab20e941f8fceded394d1a7a9e0f1617693774',
      referer: 'https://www.xsnvshen.com/album/32689'
    },
    ...opt
    // proxy: {
    //   protocol: 'https',
    //   host: "127.0.0.1",
    //   port: 7890
    // }
  })
}

module.exports = {download_image, fetchData}