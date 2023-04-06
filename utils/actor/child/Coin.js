import { createCoin } from '/utils/geometry.js'
import GameObject from '/utils/actor/GameObject.js'

export default class Coin extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: createCoin(), name: 'coin', pos })
  }

  update(delta) {
    this.mesh.rotation.z -= 2 * delta
  }
}