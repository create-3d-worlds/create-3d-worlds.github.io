import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'nature/cloud/lowpoly.gltf', size: 20, angle: Math.PI })

export default class Cloud extends GameObject {
  constructor({ mapSize = 400, ...rest } = {}) {
    super({ mesh, ...rest })
    this.mesh.position.y = 120
    this.halfSize = mapSize / 2
    this.speed = Math.random() + .5
  }

  update(delta) {
    this.position.x += delta * this.speed

    if (this.position.x > this.halfSize)
      this.position.x = -this.halfSize
  }
}
