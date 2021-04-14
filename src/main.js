const { fetchData, handlerError } = require('./fetch');
const cheerio = require('cheerio');
const config = require('../config')
const parsePage = require('./singleGallery')

fetchData(config.url).then(
  (res) => {
    if (res.status === 200) {
      console.log('开始解析根页面')
      getAllUrl(res.data)
    }
  },
  err => {
    console.log('获取根页面出错')
  }
)

async function getAllUrl(html){
  const $html = cheerio.load(html)
  // 获取当前模特所有图集链接
  const aList = $html('body .showbox a[title]')
  const total = aList.length
  // const nList = aList.slice(100, 103)
  for (const [index, node] of Object.entries(aList)) {
    const num = parseInt(index) + 1
    if(isNaN(num) || !node.attribs){return}
    console.log(`开始下载图集：(${num}/${total})`)
    await fetchPage(config.www + node.attribs.href, 5)
  }
  console.log('全部下载结束，程序退出')
}

function fetchPage(url, retryLeft){
  return fetchData(url).then(
    async (res) => {
      if (res.status === 200) {
        await parsePage(res.data)
      }
    },
    error => {
      if(handlerError(error, url, retryLeft)){
        fetchPage(url, retryLeft - 1)
      }
    }
  )
}