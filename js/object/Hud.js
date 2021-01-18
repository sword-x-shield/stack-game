import Base from './Base'
import { OrthographicCamera, WebGLRenderer, Mesh, PlaneGeometry,CanvasTexture, CameraHelper, Vector3, Scene, LinearFilter, MeshBasicMaterial, MeshToonMaterial, Color } from '../threejs/three.js'
/**
 * 平视显示器的基类
 */
export default class Hud  {
  /**
   * 构造一个副屏
   * @param {WebGLRenderer} renderer 主屏所使用的渲染器
   */
  constructor(renderer) {
    this.renderer = renderer
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.devicePixelRatio = window.devicePixelRatio
  }
  /**
   * 初始化
   */
  init() {
    this.createScene()
    this.createCamera()
    this.createPlane()
    this.createCanvas()
    this.material = new MeshBasicMaterial({opacity: 0})
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(0,0,0)
    this.scene.add(this.mesh)
  }
  /**
   * 构造一个场景
   */
  createScene() {
    this.scene = new Scene()
  }
  /**
   * 创建一个hud相机
   */
  createCamera() {
    const camera = new OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, -10, 10);
    camera.updateProjectionMatrix();
    camera.position.set(0,0,0)
    this.camera = camera
    // this.scene.add(new CameraHelper( camera ))
  }
  /**
   * 创建平面的几何体作为背景板
   */
  createPlane(width, height) {
    // 作为装内容的平面
    this.geometry = new PlaneGeometry(this.width,this.height)
  }
  /**
   * 创建画布区
   */
  createCanvas() {
    const hudCanvas = wx.createCanvas()
    hudCanvas.width = this.width
    hudCanvas.height = this.height
    const ctx = hudCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
    this.ctx = ctx
    this.canvas = hudCanvas
  }
  /**
   * 绘制内容
   */
  drawContent() {
    this.ctx.restore()
    this.draw()
    this.material = this.covertToMaterial(this.canvas)
    this.mesh.material = this.material
    this.ctx.save()
  }
  /**
   * 绘制要显示的内容，继承类使用此方法
   */
  draw() {
   console.log('draw Hud')
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
  render() {
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  }
}