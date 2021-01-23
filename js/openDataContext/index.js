// 初始化用户最高分
let userHighScore = 0 
wx.getUserCloudStorage({
  keyList: ['score'],
  success: ({KVDataList}) => {
    userHighScore = + KVDataList.find(i => i.key === 'score').value || 0
  }
})

// 初始化离屏画布
let SHARED_CANVAS = wx.getSharedCanvas() 

// 对外链接
wx.onMessage((data) => {
  const { event, data: activeData } = JSON.parse(data)
  switch(event) {
    case 'uploadHighScore':
      uploadHighScore(activeData)
      break
    case 'drawRank': 
      drawRank()
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

/**
 * 绘制排行榜
 */
function drawRank() {
  wx.getFriendCloudStorage({
    keyList: ['score'],
    success: res => {
      const data = processData(res.data)
      drawSharedCanvas(data)
    }
  })
}

/**
 * 处理微信 API 获得的原始数据，获得绘制排行榜所需的数据
 */
function processData (data) {
  return data.map(player => {
    const score = player.KVDataList.find(({key}) => key === 'score').value
    if(!score) return null
    player.score = +score
    return player
  })
  .filter(player => player !== null)
  .sort((a,b) => b.score - a.score)
  .slice(0,3)
}

/**
 * 绘制排行榜
 * @param {Array} players -前三名
 */
function drawSharedCanvas(players) {
  const context = SHARED_CANVAS.getContext('2d')
  // 清除之前绘制的排行
  context.clearRect(0, 0, SHARED_CANVAS.width, SHARED_CANVAS.height)
  // 使用百分比来绘图
  const VW = SHARED_CANVAS.width / 100
  const VH = SHARED_CANVAS.height / 100
  const AVATAR_R = 10 * VW
  drawWrapper(context, VW,VH)
  players.forEach((player,index) => {
    const {avatarUrl,nickname,score} = player
    drawAvatar(context,avatarUrl, AVATAR_R + 3 * AVATAR_R * index ,35 * VH, AVATAR_R,index)
    drawText(context,nickname, AVATAR_R + 3 * AVATAR_R * index + AVATAR_R, 60 * VH + AVATAR_R,'bold 32px Arial')
    drawText(context,score, AVATAR_R + 3 * AVATAR_R * index + AVATAR_R, 90 * VH, '70px Excluded' )
  })
}

// 绘制排行榜容器
function drawWrapper(ctx,VW,VH) {
  ctx.save()
  // 绘制整个背景
  ctx.fillStyle = 'rgba(0,0,0,.6)'
  ctx.shadowBlur = 5;
  ctx.shadowColor = "#eee";
  ctx.fillRect(0,0, 100 * VW, 100 * VH)
  // 绘制标题区背景
  ctx.fillStyle = '#000'
  ctx.fillRect(0,0,100 * VW, 20 * VH )
  // 绘制标题区文字
  ctx.fillStyle = '#fff'
  ctx.font = '80px Excluded'
  ctx.textAlign = 'center'
  ctx.fillText('T O P 3', 50 * VW , 15 * VH)
  ctx.restore()
}
//绘制排名
function drawIndex(ctx,text,x,y) {
  ctx.save()
  ctx.font = '70px Excluded'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#7BFF39'
  ctx.strokeStyle = '#fff'
  ctx.fillText(text,x, y)
  ctx.restore()
}

// 绘制头像
function drawAvatar(ctx,img,x,y,r,index) {
  const d = r * 2
  const cx = x + r
  const cy = y + r
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx,cy, r*1.05, 0, Math.PI * 2, false);
  ctx.fillStyle = '#F2F6FC'
  ctx.fill()
  ctx.closePath()
  ctx.restore()
  drawImage(ctx, img, cx, cy, d, d, true).then(() => {
    drawIndex(ctx,index + 1, x, y)
  })
}

// 绘制文字
function drawText(ctx,text,x,y,font) {
  ctx.save()
  ctx.font = font
  ctx.fillStyle = '#FFF'
  ctx.textAlign = 'center'
  ctx.fillText(text, x, y, SHARED_CANVAS.width / 3 )
  ctx.restore()
}

// 绘制分数
function drawScore(ctx,index,score) {
  ctx.save()
  ctx.font = '40px Excluded'
  ctx.fillStyle = '#FFF'
  ctx.textAlign = 'center'
  ctx.fillText(score, SHARED_CANVAS.width / 3 * index + 60, 210,  SHARED_CANVAS.width / 3 )
  ctx.restore()
}

/**
 * 画图片的辅助函数
 * Image 的加载是异步的，封装成 Promise 方便使用
 */
function drawImage(ctx, imgSrc, x, y, width, height,isCircle = false) {
  return new Promise((resolve) => {
    // 使用 wx.createImage() 创建图片
    const image = wx.createImage()
    // 加载成功回调
    image.onload = function () {
      // 实践发现，drawImage 若将 width height 设为 undefined ，会导致宽高变成 0
      if (width && height) {
        if(isCircle) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(x,y, width / 2, 0, Math.PI * 2, false);
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(image, x - width / 2, y - height /2, width, height)
          ctx.restore()
        }else {
          ctx.drawImage(image, x, y , width, height)
        }
      } else {
        ctx.drawImage(image, x, y)
      }
      // 绘制完毕，resolve promise
      resolve()
    }
    // 设置 src ，开始加载。没头像的加载 avatart_unknow
    image.src = imgSrc || 'images/avatar_unknow.png'
  })
}
