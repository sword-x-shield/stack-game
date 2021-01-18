import { Scene, WebGLRenderer, AmbientLight, PerspectiveCamera, DirectionalLight, Color} from '../threejs/three.js'
const Context = canvas.getContext('webgl');
/**
 * 基础场景类
 * @param {Object} context webgl画布对象
 * @param {Number} width 场景宽度
 * @param {Number} height 场景高度
 * @param {Number} deviceRatio 设备缩放比
 * @param {Scene} scene 场景
 * @param {PerspectiveCamera } camera 相机
 * @param {WebGLRenderer} renderer 渲染器
 * @param {AmbientLight} light 场景光源
 */
export default class Base {
  context;
  width;
  height;
  devicePixelRatio;
  /** 创建基础场景类  */
  constructor() {
    this.context = Context
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.devicePixelRatio = window.devicePixelRatio
  }
  /** 初始化 */
  init() {
    this.createScene()
    this.createCamera() 
    this.createRenderer()
    this.createLight()
    this.animate()
  }
  /** 创建场景 */
  createScene() {
    const scene = new Scene()
    this.scene = scene
  }
  /** 创建相机 */
  createCamera() {
    const aspect = this.width / this.height
    const camera = new PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.set(0, 1, 10);
    this.camera = camera;
  }
  /** 创建渲染器 */
  createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      context: this.context
    })
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x409EFF, 1.0);
    this.renderer.autoClear = false
    canvas.width = this.width * this.devicePixelRatio;
    canvas.height = this.height * this.devicePixelRatio;
    this.renderer.setPixelRatio(this.devicePixelRatio);
  }
  /** 创建光源 */
  createLight() {
    const light = new DirectionalLight(new Color("#ffffff"), 0.5);
    light.position.set(0, 50, 0);
    this.scene.add(light);
    const ambientLight = new AmbientLight(new Color("#ffffff"), 0.4);
    this.scene.add(ambientLight);
    this.light = light;
  }
  /** 更新逻辑，每一次渲染时都会被调用 */
  update() {

  }
  beforeRender() {
    this.renderer.clear();
  }
  /**
   * 后渲染钩子
   */
  afterRender() {

  }
  /** 渲染，会一直运行 */
  animate() {
    this.renderer.setAnimationLoop(() => {
      this.beforeRender()
      this.update()
      this.renderer.render(this.scene,this.camera)
      this.afterRender()
    })
  }
}