import Stack from './object/Stack'
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