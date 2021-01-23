import Stack from './object/Stack'
import EventEmiter  from './utils/eventEmiter'
window.$on = EventEmiter.on.bind(EventEmiter)
window.$emit = EventEmiter.emit.bind(EventEmiter)
// 允许分享
wx.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline']
})
wx.onShareAppMessage(() => {
  return {
    title: 'Perfect Stack',
    imageUrl: '' // 图片 URL
  }
})

// 允许分享到朋友圈
wx.onShareTimeline(() => {
  return {
    title: 'Perfect Stack',
    imageUrl: '', // 图片 URL
  }
})

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.start()
  }
  start() {
    const base = new Stack()
    base.init()
  }
}