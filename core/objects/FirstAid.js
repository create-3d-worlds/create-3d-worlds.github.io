import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'item/first-aid-kit/4X1LECF6RT2DKR1BQH4NBTCP3.obj', mtl: 'item/first-aid-kit/4X1LECF6RT2DKR1BQH4NBTCP3.mtl', size: .4, shouldAdjustHeight: true })

export default class FirstAid extends GameObject {
  constructor({ energy = 50, ...rest } = {}) {
    super({ mesh, energy, ...rest })
    this.name = 'health'
  }
}