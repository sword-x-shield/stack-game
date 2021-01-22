import Base from '../object/Base'
import { OrthographicCamera, WebGLRenderer, Mesh, PlaneGeometry,CanvasTexture, Scene, LinearFilter, MeshBasicMaterial } from '../libs/three.js'
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
    this.onlineContext = wx.getOpenDataContext()
    this.createScene()
    this.createCamera()
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
  }
  render() {
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera)
  }
}