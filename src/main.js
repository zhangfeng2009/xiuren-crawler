const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// const url = "https://www.xsnvshen.com/album/32689";
const url = "http://127.0.0.1:8080/xsnv.html";
// const url = "https://www.baidu.com/";
// const url = "https://www.iban.com/exchange-rates";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

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
  const aList = $html('body .showbox a')
  // 过滤前 aList length 708
  console.log(aList)
  
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

/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) => {
  axios({
    url,
    responseType: 'stream',
  }).then(
    response => {
      console.log('response', response)
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
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



// (async () => {
//   let example_image_1 = await download_image('https://img.xsnvshen.com/album/22162/32689/000.jpg', 'example-1.png');

//   console.log('example_image_1', example_image_1); // true

// })();