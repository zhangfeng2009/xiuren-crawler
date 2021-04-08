const { download_image, fetchData } = require('./fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const www = 'https://www.xsnvshen.com'
const url = "https://www.xsnvshen.com/album/32689";
// const url = "http://127.0.0.1:8080/xsnv.html";
// const url = "https://www.baidu.com/";
// const url = "https://www.iban.com/exchange-rates";
const modelName = '杨晨晨'
const rootPath = '..'
const multiPeer = 50


fetchData(url).then(
  (res) => {
    if (res.status === 200) {
      getAllUrl(res.data)
    }
  },
  err => {
    console.log('error3')
  }
)

async function getAllUrl(html){
  const $html = cheerio.load(html)
  // 过滤前 aList length 708
  // has title 344
  const aList = $html('body .showbox a[title]')
  const nList = aList.slice(0, 2)
  for (const node of aList) {
    // console.log(node)
    await fetchData(www + node.attribs.href).then(
      async (res) => {
        if (res.status === 200) {
          await parsePage(res.data)
        }
      },
      err => {
        console.log('error2')
      }
    )
  }
  // console.log(aList)
}

async function parsePage(html) {
  const $html = cheerio.load(html)
  // 过滤前 aList length 708
  // has title 344
  const title = $html('.swp-tit.layout a').text()
  // 69
  const total = parseInt($html('.swpt-time#time > span:first').text().replace(/[^0-9]/ig, ""))
  // '//img.xsnvshen.com/album/22162/32689/000.jpg' 000-068
  const imgSrc = $html('#bigImg')[0].attribs.src
  const imgWithoutFilename = imgSrc.substring(0, imgSrc.length - 7)

  const path = `${rootPath}/${modelName}/${title}/`
  if(mkdir(path)){return}
  const queue = []
  for (let index = 0; index < total; index++) {
    const num = index.toString().padStart(3, '0');
    const imgFilename = `${num}.jpg`
    queue.push({
      url: `https:${imgWithoutFilename}${imgFilename}`,
      imgFilename,
    })
    
  }
  const twoDimenQueue = sliceArray(queue, multiPeer)
  for (const subQueue of twoDimenQueue) {
    const pArr = subQueue.map((opt) => {
      return download_image(opt.url, path, opt.imgFilename, 5)
      .then((res)=> res,(res)=>{console.log('error1')})
    })
    await Promise.all(pArr)
  }
  console.log(`下载完成:${title}`)
}

function mkdir(path) {
  const exist = fs.existsSync(path)
  if (!exist) {
    fs.mkdirSync(path, { recursive: true });
  }
  return exist
}

/*
 * 将一个数组分成几个同等长度的数组
 * array[分割的原数组]
 * size[每个子数组的长度]
 */
function sliceArray(array, size) {
  var result = [];
  for (var x = 0; x < Math.ceil(array.length / size); x++) {
    var start = x * size;
    var end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}


// (() => {
//   download_image('https://img.xsnvshen.com/album/22162/32689/068.jpg', '../杨晨晨/', '068.jpg');
// })();