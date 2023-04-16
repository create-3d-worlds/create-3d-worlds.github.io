import { createBox } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'
import { sample } from '/utils/helpers.js'

export default class Platform extends GameObject {
  constructor({
    axis = sample(['x', 'y', 'z']), // Math.random() > .5 ? 'x' : 'z',
    range = 10,
    speed = 2,
    randomDirChange = false,
    file = 'metal/platform.png',
    pos,
  } = {}) {
    super({ mesh: createBox({ width: 5, height: 1, depth: 2.5, file }), pos })
    this.axis = axis
    this.range = range
    this.speed = speed
    this.randomDirChange = randomDirChange
    this.initPosition = this.position.clone()
  }

  get player() {
    return this.scene?.getObjectByName('player')
  }

  get playerOnPlatform() {
    if (!this.player) return false
    return this.withinHeight && this.withinWidth
  }

  get withinHeight() {
    return this.player.position.y <= this.position.y + this.height // -9
      && this.player.position.y > this.position.y // -10
  }

  get withinWidth() {
    return this.player.position.x > this.position.x - this.width * .45
      && this.player.position.x < this.position.x + this.width * .45
  }

  checkBounds() {
    if (this.position[this.axis] >= this.initPosition[this.axis] + this.range
      || this.position[this.axis] <= this.initPosition[this.axis] - this.range)
      this.speed = -this.speed
  }

  randomizeDir() {
    if (Math.random() > .997) this.speed = -this.speed
  }

  move(delta) {
    this.checkBounds()
    if (this.randomDirChange) this.randomizeDir()
    this.position[this.axis] += this.speed * delta
  }

  sync(delta) {
    this.player.position[this.axis] += this.speed * delta
  }

  update(delta) {
    this.move(delta)
    if (this.playerOnPlatform) this.sync(delta)
  }
}
