
import { OrthographicCamera, Mesh, Color, Vector3 } from '../threejs/three.js'
import { randomIntegerInRange, randomNumberInRange } from '../utils/index'
import { gsap } from  '../gsap/gsap'
import Base from './Base'
import Cube from './Cube'
import Hud from '../ui/GameHud'
/**
 * 游戏本体类
 * @extends Base
 * @param {Object} cameraParams 相机参数
 * @param {Vector3} cameraPosition 相机放置位置
 * @param {Vector3} lookAtPosition 相机朝向
 * @param {Number} colorOffset 颜色偏移量（用于决定下一个方块的颜色）
 * @param {Number} level 当前关卡
 * @param {Number} currentY 当前底部的y轴坐标
 * @param {'paused'|'running'|'end'} state 当前游戏状态
 * @param {Number} speed 当前盒子的移动速度
 * @param {Number} speedLimit 速度上限
 * @param {Object} cubeParams 当前盒子的参数
 * @param {Cube} box 当前盒子
 * @param {Number} moveLimit 边界
 * @param {'x'|'z'} moveAxis 沿何轴开始移动
 * @param {'width'| 'depth'} moveEdge 移动时变更的属性
 */
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
  currentY;
  state;
  speed;
  speedLimit = 0.06;
  moveLimit = 1.2;
  constructor() {
    super()
    this.cameraParams = {};
    this.updateCameraParams();
    this.cameraPosition = new Vector3(2, 2, 2);
    this.lookAtPosition = new Vector3(0, 0, 0);
    this.colorOffset = randomIntegerInRange(0, 255);
    this.level = 0;
    this.currentY = 0;
    this.cubeParams = { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: new Color("#d9dfc8") };
    this.state = 'paused'
    this.speed = 0.02
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
  }
  /**
   * 创建hud
   */
  createHud() {
    this.hud = new Hud(this.renderer)
  }
  /**
   * 为场景添加全局的绑定事件
   */
  addEvent() {
   document.addEventListener('touchstart',() => {
     this.state === 'running' && this.cutOverlap()
   })
   this.state === 'running' && this.cutOverlap()
   $on('stateChange', state => {
     if(state === 'running') {
      this.state = 'running'
      this.startGame()
     }
   })
  }
  /**
   * 场景初始化
   */
  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.resetCube()
    this.createLight();
    this.updateColor();
    this.addEvent();
    this.createHud();
    this.animate();
  }
  /**
   * 开始游戏
   */
  startGame() {
    // 清空可能存在的上一局
    this.createNewStack()
    this.nextLevel()
  }
  /**删掉原有塔，创建一个新的空白塔 */
  createNewStack() {
    const meshs = this.scene.children.filter(node => node instanceof Mesh)
    meshs.forEach(i => this.scene.remove(i))
    this.level = 0
    this.currentY = 0
    this.speed = 0.02
    this.colorOffset = randomIntegerInRange(0, 255);
    this.resetCube()
    this.updateColor()
    this.resetCameraHeight()
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
  /** 重置盒子 */
  resetCube() {
    this.cubeParams = { width: 1, height: 0.2, depth: 1, x: 0, y: 0, z: 0, color: new Color("#d9dfc8") }
    const baseParams = { ...this.cubeParams };
    const baseHeight = 2.5;
    baseParams.height = baseHeight;
    baseParams.y -= (baseHeight - this.cubeParams.height) / 2;
    const base = this.createCube(baseParams);
    this.cube = base;
  }
  /**
   * 切割方块，当用户点击放置方块时，判断是否游戏结束，未结束则切割保留有效的部分。
   */
  cutOverlap() {
    const { cubeParams, moveEdge,cube, moveAxis } = this;
    const curPosition = cube.position[moveAxis]
    const prevPosition = cubeParams[moveAxis]
    const direction = Math.sign(curPosition - prevPosition)
    const edge = cubeParams[moveEdge]
    // 重叠距离 = 上一个方块的边长 + 方向 * (上一个方块位置 - 当前方块位置)
    const overlap = edge + direction * (prevPosition - curPosition);
    // 移除现有盒子（后面使用新建的两个盒子实现切除效果）
    this.scene.remove(cube)
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
    // 广播重合度
    $emit('coverChange', (overlap/this.cubeParams[moveEdge] * 100).toFixed(1))
    this.createCube(overlapcubeParams);
    this.cubeParams = overlapcubeParams
  }
  /**
   * 创建需要被切除部分的盒子
   * @param {Number} prevPosition 此前的位置
   * @param {1|-1} direction 方向
   * @param {Number} edge 切除基础线，超过此值的会被切掉
   * @param {Number} overlap 有效长度
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
   * @param {Cube} cube 目标盒子
   */
  makeDrop(cube) {
    const { moveAxis } = this;
    gsap.to(cube.position, {
      y: "-=3.2",
      ease: "power1.easeIn",
      duration: 1.5,
      onComplete: () =>  this.scene.remove(cube)
    });
    gsap.to(cube.rotation, {
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
    this.stateChange('end')
  }
  /**
   * 下一关的逻辑
   */
  nextLevel() {
    this.level++;
    // 发布关卡变更广播
    $emit('levelChange',this.level)
    this.moveAxis = this.level % 2 ? "x" : "z";
    this.moveEdge = this.level % 2 ? "width" : "depth";
    this.updateColor();
    const cubeParams = { ...this.cubeParams };
    this.currentY += cubeParams.height
    cubeParams.y = this.currentY;
    const box = this.createCube(cubeParams);
    this.cube = box;
    // 确定初始移动位置
    this.cube.position[this.moveAxis] = this.moveLimit * -1;
    if (this.level >= 1) {
      this.updateCameraHeight();
      this.speed < this.speedLimit && (this.speed += 0.0005)
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
   * 重置相机高度
   */
  resetCameraHeight() {
    this.cameraPosition = new Vector3(2, 2, 2);
    this.lookAtPosition = new Vector3(0,0,0);
    gsap.to(this.cameraPosition, {
      y: this.cameraPosition.y,
      duration: 0.4
    })
    gsap.to(this.camera.lookAt, {
      y: this.lookAtPosition.y,
      duration: 0.4
    })

  }
  /**
   * 更新游戏当前状态
   */
  stateChange(state) {
    this.state = state
    $emit('stateChange',state)
  } 
  /**
   * 动画更新，逐帧调用
   */
  update() {
    if (this.state === "running") {
      const { moveAxis } = this;
      this.cube.position[moveAxis] += this.speed;
      // 移到末端就反转方向
      if (Math.abs(this.cube.position[moveAxis]) > this.moveLimit) {
        this.speed = this.speed * -1;
      }
    }
  }
  /**
   * 副屏渲染用的钩子
   */
  afterRender() {
    this.hud.render()
  }
}