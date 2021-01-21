import UIComponent from './UIComponent'
/**
 * 实时分数显示
 * @extends UIComponent
 */
export default class ScoreText extends UIComponent {
  /**
   * 
   * @param {*} scene 需要显示在上面场景
   * 
   */
  constructor(scene) {
    super(scene,
    {
      width: innerWidth,
      height: innerHeight,
      text: 'Stack',
      x: 0,
      y: innerHeight/3,
      fontSize: 54
    })
  }
  /**
   * 
   * @param {String|Number} score 分数
   */
  setScore(score) {
    this.update({text: score})
  }
}
