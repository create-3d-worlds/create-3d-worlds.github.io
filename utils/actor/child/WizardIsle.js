import GameObject from '/utils/actor/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'building/wizard-isle/model.fbx', size: 20 })

export default class WizardIsle extends GameObject {
  constructor(param = {}) {
    super({ mesh, ...param })
    this.time = Math.random()
    this.mesh.rotateY(this.time * Math.PI * 2)
    this.initialY = this.position.y
  }

  update(delta) {
    this.time += delta * .5
    this.position.y = this.initialY + Math.sin(this.time)
  }
}