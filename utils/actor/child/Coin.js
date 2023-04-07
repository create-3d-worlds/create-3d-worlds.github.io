import { createCoin } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Coin extends GameObject {
  constructor(param = {}) {
    super({ mesh: createCoin(), name: 'coin', ...param })
    this.mesh.rotateZ(Math.random() * Math.PI)
  }

  update(delta) {
    this.mesh.rotateZ(2 * delta)
  }
}