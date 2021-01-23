import UIComponent from './UIComponent'
/**
 * 排行榜
 * @extends UIComponent
 */
export default class RankList extends UIComponent {
  /**
   * 
   * @param {*} scene 需要显示在上面场景
   * 
   */
  constructor(scene) {
    super(scene,
    {
      width: innerWidth - 40,
      height: innerHeight / 2.7,
      x: 0,
      y: 0,
      text: ''
    })

  }
  createMaterial() {
    this.openContext = wx.getOpenDataContext()
    const { width, height} = this.params
    this.canvas = this.openContext.canvas
    this.canvas.width = width * devicePixelRatio
    this.canvas.height = height * devicePixelRatio
    this.postMessage()
    this.material = this.covertToMaterial(this.canvas)
  }
  addToScene() {
    this.postMessage()
    setTimeout(() => {
      this.scene.add(this.mesh)
    },200)
  }
  postMessage() {
    this.openContext.postMessage(JSON.stringify({event: 'drawRank'}))
  }
  updateRanking() {
    this.texture.needsUpdate = true
  }
}
