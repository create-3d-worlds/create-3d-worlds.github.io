import config from '/config.js'
import { createCoin } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Coin extends GameObject {
  constructor(param = {}) {
    super({ mesh: createCoin(), name: 'coin', ...param })
    this.mesh.rotateZ(Math.random() * Math.PI)
    this.audio = new Audio('/assets/sounds/fairy-arcade-sparkle.mp3')
    this.audio.volume = config.volume
    this.audio.preload = 'auto'
  }

  playSound() {
    this.audio.currentTime = 0
    this.audio.play()
  }

  dispose() {
    super.dispose()
    this.playSound()
  }

  update(delta) {
    this.mesh.rotateZ(2 * delta)
  }
}