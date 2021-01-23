import UIComponent from './UIComponent'
/**
 * 开始按钮/重开按钮
 * @extends UIComponent
 */
export default class StartBtn extends UIComponent {
  /**
   * 
   * @param {*} scene 需要显示在上面场景
   * 
   */
  constructor(scene) {
    super(scene,
    {
      width: 180,
      height: 60,
      x: 0,
      y: -window.innerHeight/4,
      texture: 'startBtn.png'
    })
    this.onClick(this.handleClick.bind(this))
    this.watchSate()
  }
  /**
   * 处理点击事件
   */
  handleClick() {
    $emit('stateChange', 'running')
  }
  /**
   * 注册监听当前游戏状态的函数
   */
  watchSate() {
    $on('stateChange',state => {
      this.state = state
      setTimeout(() => {
        state === 'running' ? this.removeFromScene() : this.addToScene()
      }, 500)
    })
  }

}
