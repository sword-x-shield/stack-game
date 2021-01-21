import {  Mesh, PlaneGeometry,CanvasTexture,LinearFilter,MeshBasicMaterial,TextureLoader, Vector3 } from '../threejs/three.js'
const defaultConfig = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fillStyle: '',
  fontSize: 16,
  callback: undefined,
  background: undefined,
  texture: undefined
}
/**
 * 按钮基类，需要放入hud场景中以保证它的正常显示
 */
export default class UIComponent {
  isOnScene = false;
  /**
   * 构造按钮
   * @param {Scene} scene 所属场景
   * @param {Object} params 参数
   * @param {Number?} params.x x中点坐标
   * @param {Number?} params.y y中点坐标
   * @param {Number?} params.width 宽度
   * @param {Number?} params.height 高度
   * @param {String?|Object} params.fillStyle 文字颜色
   * @param {String} params.background 背景贴图
   * @param {String} params.text 文字
   * @param {Number} params.fontSize 字号
   */
  constructor(scene, params) {
    this.scene  = scene
    this.params = Object.assign({}, defaultConfig, params)
    this.createPlane(params)
    this.createMaterial(params)
    this.mesh = new Mesh(this.plane, this.material)
    this.setDefaultPosition(params)
  }
  /** 绑定点击事件,不会在构造器中调用，需要手动调用。
   * 
   */
  onClick(callback) {
    // 有回调事件再绑定，节省性能
    callback && document.addEventListener('touchstart', ({ touches }) => {
      const touch = [...touches].pop()
      // 还在场景中且点击坐标位于当前对象内则执行回调
      this.isOnScene && this.isClickInside(touch) && callback()
    })
  }

  /**
   * 创建按钮容器
   */
  createPlane() {
    const { width, height } = this.params
    this.plane = new PlaneGeometry(width, height)
  }
  /**
   * 创建材质
   */
  createMaterial() {
    const { texture, width, height} = this.params
    // 使用纹理背景的直接加载背景跳过绘制阶段
    if(texture !== undefined) {
      this.material = this.loadTexture(texture)
      return
    }
    this.canvas = wx.createCanvas()
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')
    this.draw(this.ctx)
    this.material = this.covertToMaterial(this.canvas)
  }
  /**
   * 获取填充样式
   * @param {CanvasRenderingContext2D} ctx 画布的context
   * @param {String?} fillStyle 原定样式,允许不填
   * @param {Number?} width 画布之宽，只有未设定样式时需要此参数
   */
  getFill(ctx,fillStyle, width) {
    return fillStyle || '#fff'
  }
  /** 绘制画布
   * @param {CanvasRenderingContext2D} ctx canvas画布对象
   */
  draw(ctx) {
    const { width, height, fillStyle, fontSize, text } = this.params
    ctx.clearRect(0,0,width,height)
    ctx.restore()
    ctx.fillStyle = this.getFill(ctx,fillStyle,width)
    ctx.textAlign = "center"
    ctx.font = `${fontSize}px Impact`
    ctx.fillText(
      text,
      width / 2,
      height / 2
    )
    ctx.save()
  }
  /**
   * 加载材质
   * @param {String} texture images文件夹下的图片名称
   * @returns {MeshBasicMaterial} 材质对象
   */
  loadTexture(texture) {
    const textureMaterial = new TextureLoader().load( `images/${texture}` );
    return new MeshBasicMaterial( { map: textureMaterial, transparent: true } );
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
   * 
   */
  setDefaultPosition() {
    this.mesh.position.x = this.params.x
    this.mesh.position.y = this.params.y
  }
  /**
   * 将按钮添加至场景中
   */
  addToScene() {
    this.scene.add(this.mesh)
    this.isOnScene = true
  }
  /**
   * 将按钮从场景中移除
   */
  removeFromScene() {
    this.scene.remove(this.mesh)
    this.isOnScene = false
  }
  /**
   * 判断当前触摸点是否位于组件内
   * @param {Touch} touch 触摸点
   */
  isClickInside(touch) {
    const { pageX, pageY } = touch
    const { x1, x2, y1, y2 } = this.getPositionInScreen()
    return x1 <= pageX && pageX <= x2 && y1 <= pageY && pageY <= y2
  }
  /**
   * 获取当前组件在屏幕上的范围坐标
   * @return {{x1,y1,x2,y2}} 在屏幕坐标
   */
  getPositionInScreen() {
    const {x,y,height,width} = this.params
    return  {
      x1: innerWidth / 2 - width / 2 + x,
      x2: innerWidth / 2 + width / 2 + x,
      y1: innerHeight / 2 - height / 2 - y,
      y2: innerHeight /2 + height / 2 - y
    }
  }
  /**
   * 更新组件样式,不包含尺寸更新
   */
  update(params) {
    this.params = Object.assign({},this.params,params)
    this.draw(this.ctx)
    this.removeFromScene()
    this.mesh.material = this.material = this.covertToMaterial(this.canvas)
    this.addToScene()
  }
}