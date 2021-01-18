import Hud from './Hud'
/**
 * 实时分数显示
 * @extends Hud
 */
export default class ScoreText extends Hud {
  score = 0;
  constructor(renderer) {
    super(renderer)
  }
  draw() {
    const gradient = this.ctx.createLinearGradient(0,0,this.width,0);
    gradient.addColorStop(0, "#FAF8F9")
    gradient.addColorStop(1, "#F0EFF0")
    this.ctx.fillStyle = gradient
    this.ctx.textAlign = "center"
    this.ctx.font = "60px Arial"
    this.ctx.fillText(
      this.score,
      this.width / 2,
      this.height / 4
    )
  }
  update(score) {
    this.score = score
    this.ctx.clearRect(0,0,this.width,this.height)
    this.drawContent()
    this.render()
  }
}
