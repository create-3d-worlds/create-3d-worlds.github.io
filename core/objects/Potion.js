import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'item/potion/potion.obj', mtl: 'item/potion/potion.mtl', size: .75, shouldAdjustHeight: true })

export default class Potion extends GameObject {
  constructor({ energy = 50, ...rest } = {}) {
    super({ mesh, energy, ...rest })
    this.name = 'health'
  }
}