import GameObject from '/utils/actor/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'building/wizard-isle/model.fbx', size: 20 })

export default class WizardIsle extends GameObject {
  constructor(param = {}) {
    super({ mesh, ...param })
    this.mesh.rotateY(Math.random() * Math.PI * 2)
  }

  update(delta) {

  }
}