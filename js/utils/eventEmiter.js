/**
 * 发布订阅模式类
 * @param {Object} list 订阅列表
 * @param {Object} onceList 一次性订阅列表 
 */
class EventEmitter{
  list;
  onceList;
  /** 创建一个发布订阅中心 */
  constructor() {
    this.list = {}
    this.onceList = {}
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
   * 订阅一个一次性事件
   * @param {String} eventName 订阅事件名称
   * @param {Function} fn 事件发生的回调函数
   */
  once(eventName,fn) {
    (this.onceList[eventName] || (this.onceList[eventName] = [])).push(fn)
    return this
  }
  /**
   * 发布一个事件
   * @param {String} eventName 触发一个事件
   * @returns {EventEmitter}
   */
  emit(eventName) {
    // 取出所有订阅者
    const fns = [...this.list[eventName] || []] 
    const onceFns =  [...this.onceList[eventName] || [] ]
    const hasCallback = this.hasCallback(fns)
    const hasOnceCallback = this.hasCallback(onceFns)
    const args = Array.from(arguments).slice(1)
    // 遍历执行订阅者
    hasCallback && fns.forEach(fn => fn.apply(this, args))
    // 处理一次性订阅者
    if(hasOnceCallback) {
      onceFns.forEach(fn => fn.apply(this,args))
      delete this.onceList[eventName]
    }
    return this
  }
  /**
   * 移除一个订阅者
   * @todo
   * @param {String} eventName 事件名
   * @param {Function} fn 要移除的回调函数
   */
  off(eventName, fn) {

  }
  /**
   * 检查当前是否存在订阅者
   * @param {Array|undefined} 订阅者
   */
  hasCallback(arr) {
    return arr && arr.length > 0
  }
}

export default new EventEmitter()