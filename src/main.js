const { fetchData } = require('./fetch');
const cheerio = require('cheerio');
const config = require('../config')
const parsePage = require('./singleGallery')

fetchData(config.url).then(
  (res) => {
    if (res.status === 200) {
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
  // const nList = aList.slice(0, 1)
  for (const node of aList) {
    await fetchData(config.www + node.attribs.href).then(
      async (res) => {
        if (res.status === 200) {
          await parsePage(res.data)
        }
      },
      err => {
        console.log('获取页面出错：' + node.attribs.href)
      }
    )
  }
}