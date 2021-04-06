const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.xsnvshen.com/album/35382";
// const url = "https://www.baidu.com/";
// const url = "https://www.iban.com/exchange-rates";

fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    // const imgs = $('.s-news-img')
    // imgs.each(function() {
    //     let img = $(this).html();
    //     console.log(img);
    // });
    const statsTable = $('.swpt-full-wrap');
    
    const body = statsTable.html()
    console.log(body)
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