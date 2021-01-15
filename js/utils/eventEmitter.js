/**
 * 发布订阅模式类
 * @param {Object} list 订阅列表
 * 
 */
class EventEmitter{
  list;
  /** 创建一个发布订阅中心 */
  constructor() {
    this.list = {}
  }
  /**
   * 订阅一个事件
   * @param {String} eventName 订阅事件的名称
   * @param {Function} fn 事件发生时的回调函数
   * @returns {EventEmitter} 返回对象本身
   */
  on(eventName, fn) {
    (this.list[eventName] || (this.list[eventName] = [])).push(fn);
    return this;
  }
  /**
   * 发布一个事件
   * @param {String} eventName 触发一个事件
   * @returns {EventEmitter}
   */
  emit(eventName) {
    // 取出所有订阅者
    const fns = [...this.list[eventName]]
    if(!fns || fns.length === 0) {
      return false
    }
    // 遍历执行订阅者
    fns.forEach(fn => fn.apply(this, arguments))
    return this
  }
}

export default new EventEmitter()