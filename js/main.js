import Stack from './object/Stack'
import EventEmiter  from './utils/eventEmiter'
window.$on = EventEmiter.on.bind(EventEmiter)
window.$emit = EventEmiter.emit.bind(EventEmiter)
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.start()
  }
  start() {
    const base = new Stack()
    base.init()
  }
}