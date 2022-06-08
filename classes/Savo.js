import Player from '/classes/Player.js'
import { createBox } from '/utils/geometry.js'
import { camera } from '/utils/scene.js'

export default class Savo extends Player {
  constructor({ speed, ...params } = {}) {
    const mesh = createBox({ size: 2 })
    mesh.material.opacity = 0
    mesh.material.transparent = true
    super({ mesh, autoCamera: false, ...params })
    this.speed = speed || this.size * 3
  }

  update(delta) {
    super.update(delta)
    const target = this.mesh.position.clone()
    target.y = this.mesh.position.y + this.size
    camera.lookAt(target)
  }
}
