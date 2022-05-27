import Player from '/classes/Player.js'
import { createPlayerBox } from '/utils/boxes.js'
import { camera } from '/utils/scene.js'

export default class Savo extends Player {
  constructor({ speed, ...params } = {}) {
    super({ mesh: createPlayerBox({ size: 2, transparent: true }), autoCamera: false, ...params })
    this.speed = speed || this.size * 3
  }

  update(delta) {
    super.update(delta)
    const target = this.mesh.position.clone()
    target.y = this.mesh.position.y + this.size
    camera.lookAt(target)
  }
}
