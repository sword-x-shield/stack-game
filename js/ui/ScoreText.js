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
      width: window.innerWidth,
      height: window.innerHeight,
      text: 'Stack',
      x: window.innerWidth / 2,
      y: window.innerHeight / 5,
      fontSize: 50
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
