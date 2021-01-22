let userHighScore = 0 // 用户最高分
// 先获取用户存储在远端的最高分
wx.getUserCloudStorage({
  keyList: ['score'],
  success: ({KVDataList}) => {
    userHighScore = + KVDataList.find(i => i.key === 'score').value || 0
  }
})

wx.onMessage((data) => {
  const { event, data: activeData } = JSON.parse(data)
  switch(event) {
    case 'uploadHighScore':
      uploadHighScore(activeData)
      break
    default: 
  }
})


/**
 * 更新最高分
 * @param {number} score 最高分
 */
function uploadHighScore(score) {
  score > userHighScore && wx.setUserCloudStorage({
    KVDataList: [{
      key: "score",
      value: `${score}`
    }],
    success: () => {
      console.log('uploaded high score')
    },
    fail: (e) => {
      console.log(e)
    }
  })
}