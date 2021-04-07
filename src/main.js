const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// const url = "https://www.xsnvshen.com/album/32689";
const url = "http://127.0.0.1:8080/xsnv.html";
// const url = "https://www.baidu.com/";
// const url = "https://www.iban.com/exchange-rates";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const modelName = '杨晨晨'


fetchData(url).then(
  (res) => {
    if (res.status === 200) {
      parseData(res.data)
    }
  },
  err => {
    console.log(err)
  }
)

function parseData(html) {
  const $html = cheerio.load(html)
  // 过滤前 aList length 708
  // has title 344
  const aList = $html('body .showbox a[title]')
  const title = $html('.swp-tit.layout a').text()
  // 69
  const total = parseInt($html('.swpt-time#time > span:first').text().replace(/[^0-9]/ig,""))
  // '//img.xsnvshen.com/album/22162/32689/000.jpg' 000-068
  const imgSrc = $html('#bigImg')[0].attribs.src
  const img1 = imgSrc.substring(0, imgSrc.length - 7)
  console.log(img1)
  
  // const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
  // console.log(statsTable)
  // statsTable.each(function() {
  //     let title = $(this).find('td').text();
  //     console.log(title);
  // });
}

function fetchData(url) {
  // make http call to url
  return axios(url, {
    // withCredentials: true,
    headers: {
      cookie: '__cfduid=dd807ab20e941f8fceded394d1a7a9e0f1617693774',
      referer: 'https://www.xsnvshen.com/album/32689'
    },
    // proxy: {
    //   protocol: 'https',
    //   host: "127.0.0.1",
    //   port: 7890
    // }
  })
}

/**
 * @params
 * @url 图片地址
 * @path 输出文件地址
 * @filename 输出文件名
 */
const download_image = (url, path, filename) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
  }
  axios({
    url,
    responseType: 'stream',
  }).then(
    response => {
      // console.log('response', response)
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(path + filename))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      })
    },
    error => {
      console.log('error', error.response.status)
      const status = error.response.status
      if (status === 404) {
        /* do nothing */
      }
    }
  ).catch(err => {
    console.log('err', err)
  })
}



(() => {
  download_image('https://nodejs.org/static/images/logo.svg', '../杨晨晨/test/', 'logo.svg');
})();