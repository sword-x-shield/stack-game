import Hud from './Hud'
import ScoreText from './ScoreText'
import CoverScoreText from './CoverScoreText'
import StartBtn from './StartBtn'
import RankList from './RankList'
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
    // 初始化分数与标题
    this.scoreComp = new ScoreText(this.scene)
    this.scoreComp.addToScene()
    // 初始化开始按钮
    this.startBtn = new StartBtn(this.scene)
    this.startBtn.addToScene()
    // 初始化操作评分
    this.coverScoreComp = new CoverScoreText(this.scene)
    this.bindEvent()
    // 初始化排行榜
    this.rankComp = new RankList(this.scene)
    // 轮询更新排行榜
    setInterval(() => {
      this.rankComp.updateRanking()
    }, 200)

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
    $on('coverChange',cover => this.coverScoreComp.setCover(cover))
  }
  /**
   * 游戏结束事件
   */
  gameOver() {
    const curScore = this.scoreComp.getScore()
    const highScore = localStorage.getItem('highScore') || 0
    if(curScore > highScore) {
      this.coverScoreComp.update({text: 'New High Score'})
      localStorage.setItem('highScore', curScore)
      this.onlineContext.postMessage(JSON.stringify({event: 'uploadHighScore', data: curScore}))
    }
   this.rankComp.addToScene()
  }
  startGame() {
   this.startBtn.removeFromScene()
   this.rankComp.removeFromScene()
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
