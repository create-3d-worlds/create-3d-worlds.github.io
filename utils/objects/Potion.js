import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'item/potion/potion.obj', mtl: 'item/potion/potion.mtl', size: .5, shouldAdjustHeight: true })

export default class Potion extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.name = 'potion'
  }
}