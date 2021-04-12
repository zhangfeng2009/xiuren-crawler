module.exports = {
  www: 'https://www.xsnvshen.com', // 不可修改
  url: "https://www.xsnvshen.com/album/32689", // 下载页面，从该页面当中提取当前模特的作品列表并下载
  modelName: '杨晨晨',
  downloadPath: '..', // 下载位置，相对本项目的位置，也可使用绝对位置例如 'C:'，注意结尾没有 '/'
  multiPeer: 50, // 同时下载数
  cookie: '__cfduid=dd807ab20e941f8fceded394d1a7a9e0f1617693774', // 如过期，请修改
  referer: 'https://www.xsnvshen.com/album/', // 不必修改
  rewrite: false
}