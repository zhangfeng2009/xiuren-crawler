const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// const url = "https://www.xsnvshen.com/album/35382";
// const url = "https://www.baidu.com/";
const url = "https://www.iban.com/exchange-rates";
'\n<a href="/" title="IBAN Home">\n<img src="/images/logo.png" alt="IBAN Logo" width="170" height="75">\n</a>\n'
fetchData(url).then(async (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    // const imgs = $('.s-news-img')
    // imgs.each(function() {
    //     let img = $(this).html();
    //     console.log(img);
    // });
    const statsTable = $('.logo img');
    
    const body = statsTable[0].attribs.src
    // console.log(body)
    // let example_image_1 = await download_image('https://www.iban.com/images/logo.png', 'example-1.png')

    // let example_image_1 = await download_image('https://example.com/test-1.png', 'example-1.png');

    // console.log(example_image_1); // true
    // console.log(example_image_1.error);
    // statsTable.each(function() {
    //     let title = $(this).text();
    //     console.log(title);
    // });

    // const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
    // console.log(statsTable)
    // statsTable.each(function() {
    //     let title = $(this).find('td').text();
    //     console.log(title);
    // });
})

async function fetchData(url){
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url, {
      // proxy: {
      //   protocol: 'http',
      //   host: "127.0.0.1",
      //   port: 7890
      // }
    })
    .catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
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
      if(status === 404){
        /* do nothing */
      }
    }
  ).catch(err => {
    console.log('err', err)
  })
}
  

  
(async () => {
  let example_image_1 = await download_image('https://example.com/test-1.png', 'example-1.png');

  console.log('example_image_1', example_image_1); // true

})();