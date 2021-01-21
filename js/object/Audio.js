/**
 * 音频类
 */
export default class Audio {
  /**
   * 构造一个音频
   * @param {String} path 路径
   * @param { { autoplay, loop } } config 配置参数
   */
  constructor(path, config) {
    this.audio = wx.createInnerAudioContext()
    this.audio.src = path
    Object.entries(config).forEach(([k, v]) => {
      this.audio[k] = v
    })
  }
  /**
   * 播放音频
   */
  play() {
    this.audio.play()
  }
  /**
   * 停止播放音频
   */
  stop() {
    this.audio.stop()
  }
}