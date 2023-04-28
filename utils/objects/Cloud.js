import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'nature/cloud/lowpoly.gltf', size: 20, angle: Math.PI })

export default class Cloud extends GameObject {
  constructor(param = {}) {
    super({ mesh, ...param })
    this.mesh.position.y = 120
  }

  update(delta) {

  }
}
