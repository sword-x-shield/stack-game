import UIComponent from './UIComponent'
/**
 * 当前重合度得分，也用于显示是否为新的历史最高分
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
      text: '0',
      x: 0,
      y: innerHeight / 4 + 20,
      fontSize: 30,
      fontFamily: 'Excluded'
    })
  }
  /**
   * 
   * @param {String|Number} score 分数
   */
  setCover(score) {
    this.timer && clearTimeout(this.timer)
    let config = {
      text: 'B A D',
      fillStyle: '#F56C6C'
    }
    if(score > 95) {
      config = {
        text: 'P E R F E C T',
        fillStyle: '#7BFF39'
      }
    }else if(score > 85) {
      config = {
        text: 'G O O D',
        fillStyle: '#FFF'
      }
    }else if(score > 60) {
      config = {
        text: 'O K',
        fillStyle: '#F1BF74'
      }
    }
    this.update(config)
    this.timer = setTimeout(() => {
      this.removeFromScene()
    }, 1500)
  }
}
