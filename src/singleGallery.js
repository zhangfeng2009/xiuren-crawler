const { download_image, fetchData } = require('./fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const config = require('../config')

async function parsePage(html) {
  const $html = cheerio.load(html)
  const title = $html('.swp-tit.layout a').text()

  // 获取该图集总图片数
  const total = parseInt($html('.swpt-time#time > span:first').text().replace(/[^0-9]/ig, ""))
  // 获取图片 url
  const bigimg = $html('#bigImg')[0]
  if(!bigimg){return}
  const imgSrc = bigimg.attribs.src
  const imgWithoutFilename = imgSrc.substring(0, imgSrc.length - 7)

  const path = `${config.downloadPath}/${config.modelName}/${title}/`
  // 如果文件夹存在则跳过
  if(mkdir(path) && !config.rewrite){return}

  const queue = []
  for (let index = 0; index < total; index++) {
    const num = index.toString().padStart(3, '0');
    const imgFilename = `${num}.jpg`
    queue.push({
      url: `https:${imgWithoutFilename}${imgFilename}`,
      imgFilename,
    })
  }
  // 分割队列，控制并行下载数
  const twoDimenQueue = sliceArray(queue, config.multiPeer)
  for (const subQueue of twoDimenQueue) {
    const pArr = subQueue.map((opt) => {
      return download_image(opt.url, path, opt.imgFilename, 5).catch(()=>{})
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

module.exports = parsePage