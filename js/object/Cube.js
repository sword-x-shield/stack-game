import {Color,BoxBufferGeometry,MeshToonMaterial,Mesh} from '../threejs/three.js'
/**
 * 盒子类
 * @param {BoxBufferGeometry} geo 盒子的几何对象
 * @param {MeshToonMaterial} material 盒子的材质对象
 */
export default class Cube {
  geo;
  material;
  /**
   * 
   * @param {Object} params 盒子的参数（长、宽、高、颜色、坐标）
   */
  constructor({ width = 1, height = 1, depth = 1, color = new Color("#d9dfc8"), x = 0, y = 0, z = 0 }) {
    this.geo = new BoxBufferGeometry(width, height, depth);
    this.material = new MeshToonMaterial({ color, flatShading: true });
    this.mesh = new Mesh(this.geo, this.material);
    this.mesh.position.set(x,y,z);
  }
}