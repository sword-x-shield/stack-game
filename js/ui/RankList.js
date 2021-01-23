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
      y: 0
    })

  }
  createMaterial() {
    this.openContext = wx.getOpenDataContext()
    const { width, height} = this.params
    this.canvas = this.openContext.canvas
    this.canvas.width = width * devicePixelRatio
    this.canvas.height = height * devicePixelRatio
    this.material = this.covertToMaterial(this.canvas)
  }
  addToScene() {
    this.openContext.postMessage(JSON.stringify({event: 'drawRank'}))
    this.scene.add(this.mesh)
  }
  updateRanking() {
    this.texture.needsUpdate = true
  }
}
