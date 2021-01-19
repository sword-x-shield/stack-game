import {  Mesh, PlaneGeometry,CanvasTexture,LinearFilter,MeshBasicMaterial } from '../threejs/three.js'
const defaultConfig = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fillStyle: '',
  fontSize: 16,
  callback: undefined
}
/**
 * 按钮基类，需要放入hud场景中以保证它的正常显示
 */
export default class UIComponent {
  /**
   * 构造按钮
   * @param {Scene} scene 所属场景
   * @param {Object} params 参数
   * @param {Number?} params.x 起始x坐标
   * @param {Number?} params.y 起始y坐标
   * @param {Number?} params.width 宽度
   * @param {Number?} params.height 高度
   * @param {String?|Object} params.fillStyle 文字颜色
   * @param {String} params.text 文字
   * @param {Number} params.fontSize 字号
   * @param {Function} params.callback 点击回调函数
   */
  constructor(scene, params) {
    this.scene  = scene
    this.params = Object.assign({}, defaultConfig, params)
    this.createPlane(params)
    this.createMaterial(params)
    this.mesh = new Mesh(this.plane, this.material)
    this.bindEvent(params.callback)
  }
  /** 绑定点击事件 */
  bindEvent(callback) {
    // if(callback) {
      wx.onTouchStart((result) => {
      })
    // }
  }

  /**
   * 创建按钮容器
   */
  createPlane(params) {
    this.plane = new PlaneGeometry(params.width,params.height)
  }
  /**
   * 创建材质
   */
  createMaterial(params) {
    const canvas = wx.createCanvas()
    canvas.width = params.width
    canvas.height = params.height
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.draw(params)
    this.material = this.covertToMaterial(canvas)
  }
  /**获取按钮颜色 */
  getBtnColor({fillStyle,width}) {
    if(!fillStyle) {
      const gradient = this.ctx.createLinearGradient(0,0,width,0);
      gradient.addColorStop(0, "#FAF8F9")
      gradient.addColorStop(1, "#F0EFF0")
      return gradient
    }
    return fillStyle
  }
  /** 绘制画布 */
  draw(params) {
    this.ctx.clearRect(0,0,params.width,params.height)
    this.ctx.restore()
    this.ctx.fillStyle = this.getBtnColor(params)
    this.ctx.textAlign = "center"
    this.ctx.font = `${params.fontSize}px Arial`
    this.ctx.fillText(
      params.text,
      params.x,
      params.y
    )
    this.ctx.save()
  }
   /**
   * 将画布转为材质对象
   * @param {Canvas} canvas 画布对象
   * @returns {MeshBasicMaterial} 材质对象
   */
  covertToMaterial(canvas) {
    const texture = new CanvasTexture(canvas)
    texture.minFilter = texture.magFilter = LinearFilter
    texture.needsUpdate = true
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1
    })
    return material
  }
  /**
   * 将按钮添加至场景中
   */
  addToScene() {
    this.scene.add(this.mesh)
  }
  /**
   * 将按钮从场景中移除
   */
  removeFromScene() {
    this.scene.remove(this.mesh)
  }
  /**
   * 更新组件样式,不包含尺寸更新
   */
  update(params) {
    this.params = Object.assign({},this.params,params)
    this.draw(this.params)
    this.removeFromScene()
    this.mesh.material = this.material = this.covertToMaterial(this.canvas)
    this.addToScene()
  }
}