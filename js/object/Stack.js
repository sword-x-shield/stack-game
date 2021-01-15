
import { OrthographicCamera, Mesh, CameraHelper, Color, Vector3 } from '../threejs/three.js'
import { randomIntegerInRange, randomNumberInRange } from '../utils/index'
import { gsap } from  '../gsap/gsap'
import Base from './Base'
import Cube from './Cube'
export default class Stack extends Base {
  cameraParams;
  cameraPosition;
  lookAtPosition;
  cubeParams;
  colorOffset;
  moveAxis;
  moveEdge;
  moveLimit;
  level;
  started;
  currentY;
  state;
  speed;
  constructor() {
    super()
    this.cameraParams = {};
    this.updateCameraParams();
    this.cameraPosition = new Vector3(2, 2, 2);
    this.lookAtPosition = new Vector3(0, 0, 0);
    this.colorOffset = randomIntegerInRange(0, 255);
    this.level = 1;
    this.currentY = 0;
    this.cubeParams = { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: new Color("#d9dfc8") };
    this.started = false
    this.state = 'paused'
    this.moveLimit = 1.2
    this.speed = 0.02
    this.speedLimit = 0.06
    this.score = 0
  }
  /**
   * 基于屏幕大小更新当前相机的各项参数
   */
  updateCameraParams() {
    const aspect = this.width /this.height
    const zoom = 2;
    this.cameraParams = { left: -zoom * aspect, right: zoom * aspect, top: zoom, bottom: -zoom, near: -100, far: 1000 };
  }
  /**
   * 更新下一个盒子的颜色
   */
  updateColor() {
    const { level, colorOffset } = this;
    const colorValue = (level + colorOffset) * 0.25;
    const r = (Math.sin(colorValue) * 55 + 200) / 255;
    const g = (Math.sin(colorValue + 2) * 55 + 200) / 255;
    const b = (Math.sin(colorValue + 4) * 55 + 200) / 255;
    this.cubeParams.color = new Color(r, g, b);
  }
  /**
   * 创建场景中的相机
   */
  createCamera() {
    const { cameraParams, cameraPosition, lookAtPosition } = this;
    const { left, right, top, bottom, near, far } = cameraParams;
    const camera = new OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.lookAt(lookAtPosition.x, lookAtPosition.y, lookAtPosition.z);
    this.camera = camera;
    this.scene.add(new CameraHelper( camera ))
  }
  /**
   * 创建一个盒子
   * @param {Object} cubeParams 盒子的参数
   * @returns {Mesh} 盒子的网格对象
   */
  createCube(cubeParams) {
    const cube = new Cube(cubeParams)
    this.scene.add(cube.mesh);
    return cube.mesh
  }
  /**
   * 为场景添加全局的绑定事件
   */
  addEvent() {
    wx.onTouchStart((result) => {
      this.level === 1 ? this.startGame() : this.cutOverlap()
    })
  }
  /**
   * 场景初始化
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    const baseParams = { ...this.cubeParams };
    const baseHeight = 2.5;
    baseParams.height = baseHeight;
    baseParams.y -= (baseHeight - this.cubeParams.height) / 2;
    const base = this.createCube(baseParams);
    this.box = base;
    this.createLight();
    this.updateColor();
    this.addEvent();
    this.animate();
  }
  /**
   * 开始游戏
   */
  startGame() {
    this.started = true
    this.nextLevel()
  }
  /**
   * 切割方块，当用户点击放置方块时，判断是否游戏结束，未结束则切割保留有效的部分。
   */
  cutOverlap() {
    const { cubeParams, moveEdge, box, moveAxis, camera } = this;
    const curPosition = box.position[moveAxis]
    const prevPosition = cubeParams[moveAxis]
    const direction = Math.sign(curPosition - prevPosition)
    const edge = cubeParams[moveEdge]
    // 重叠距离 = 上一个方块的边长 + 方向 * (上一个方块位置 - 当前方块位置)
    const overlap = edge + direction * (prevPosition - curPosition);
    // 移除现有盒子（后面使用新建的两个盒子实现切除效果）
    this.scene.remove(box)
    // 没有重叠的部分就输了
    if(overlap <= 0) {
      this.gameOver()
      return
    }
    this.createWastedCube(prevPosition, direction, edge, overlap)
    this.createOverlapCube(curPosition,prevPosition,overlap)
    this.nextLevel()
  }
  /**
   * 创建有效部分的盒子
   * @param {Number} curPosition 当前位置的坐标
   * @param {Number} prevPosition 此前位置（上一个方块）的坐标
   * @param {Number} overlap 有效长度
   */
  createOverlapCube(curPosition, prevPosition,overlap) {
    const { moveEdge, moveAxis, currentY,cubeParams} = this
    // 创建重叠部分的方块
    const overlapcubeParams = { ...cubeParams };
    const overlapCubePosition = curPosition / 2 + prevPosition / 2;
    overlapcubeParams.y = currentY;
    overlapcubeParams[moveEdge] = overlap;
    overlapcubeParams[moveAxis] = overlapCubePosition;
    this.createCube(overlapcubeParams);
    this.cubeParams = overlapcubeParams
  }
  /**
   * 创建需要被切除部分的盒子
   * @param {*} prevPosition 此前的位置
   * @param {*} direction 方向
   * @param {*} edge 
   * @param {*} overlap 
   */
  createWastedCube(prevPosition, direction, edge, overlap) {
    const { cubeParams, currentY, moveEdge, moveAxis } = this
    const slicedcubeParams = { ...cubeParams };
    const slicedCubeEdge = edge - overlap;
    const slicedCubePosition = direction * ((edge - overlap) / 2 + edge / 2 + direction * prevPosition);
    slicedcubeParams.y = currentY;
    slicedcubeParams[moveEdge] = slicedCubeEdge;
    slicedcubeParams[moveAxis] = slicedCubePosition;
    const slicedCube = this.createCube(slicedcubeParams);
    this.makeDrop(slicedCube)
  }
  /**
   * 使某个盒子自由落体
   * @param {Cube} box 目标盒子
   */
  makeDrop(box) {
    const { moveAxis } = this;
    gsap.to(box.position, {
      y: "-=3.2",
      ease: "power1.easeIn",
      duration: 1.5,
      onComplete: () =>  this.scene.remove(box)
    });
    gsap.to(box.rotation, {
      delay: 0.1,
      x: moveAxis === "z" ? randomNumberInRange(4, 5) : 0.1,
      y: 0.1,
      z: moveAxis === "x" ? randomNumberInRange(4, 5) : 0.1,
      duration: 1.5
    });
  }
  /**
   * 处理游戏结束的逻辑
   */
  gameOver() {
    this.started = false;
    this.state = 'end'
  }
  /**
   * 下一关的逻辑
   */
  nextLevel() {
    this.level++;
    this.moveAxis = this.level % 2 ? "x" : "z";
    this.moveEdge = this.level % 2 ? "width" : "depth";
    this.updateColor();
    const cubeParams = { ...this.cubeParams };
    this.currentY += cubeParams.height
    cubeParams.y = this.currentY;
    const box = this.createCube(cubeParams);
    this.box = box;
    // 确定初始移动位置
    this.box.position[this.moveAxis] = this.moveLimit * -1;
    this.state = "running";
    if (this.level > 1) {
      this.updateCameraHeight();
      this.speed < this.speedLimit && (this.speed += 0.005)
    }
  }
  /**
   * 更新相机高度，随方块的放置平滑上移
   */
  updateCameraHeight() {
    this.cameraPosition.y += this.cubeParams.height;
    this.lookAtPosition.y += this.cubeParams.height;
    gsap.to(this.camera.position, {
      y: this.cameraPosition.y,
      duration: 0.4
    });
    gsap.to(this.camera.lookAt, {
      y: this.lookAtPosition.y,
      duration: 0.4
    });
  }
  /**
   * 动画更新，逐帧调用
   */
  update() {
    if (this.state === "running") {
      const { moveAxis } = this;
      this.box.position[moveAxis] += this.speed;
      // 移到末端就反转方向
      if (Math.abs(this.box.position[moveAxis]) > this.moveLimit) {
        this.speed = this.speed * -1;
      }
    }
  }
}