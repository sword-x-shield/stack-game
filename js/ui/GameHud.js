import Hud from './Hud'
import ScoreText from './ScoreText'

/**
 * 游戏菜单
 * @extends Hud
 */
export default class GameHud extends Hud {
  /** 构造游戏菜单
   * @param {WebGLRenderer} renderer 渲染器
   */
  constructor(renderer) {
    super(renderer)
    this.scoreComp = new ScoreText(this.scene)
    this.scoreComp.addToScene()
    this.bindEvent()
  }
  /**
   * 绑定发布订阅
   */
  bindEvent() {
     const stateMap = {
      'end': this.gameOver,
      'running': this.startGame,
      'paused': this.paused
    }
    $on('stateChange',state => {
      stateMap[state].bind(this)()
    })
    $on('levelChange',level => this.scoreComp.setScore(level - 1))
  }
  /**
   * 游戏结束事件
   */
  gameOver() {

  }
  startGame() {
  }
  /**
   * @todo 暂停游戏
   */
  paused() {

  }
  update(score) {
    this.score = score
  }
}
