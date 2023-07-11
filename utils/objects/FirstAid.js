import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'item/first-aid-kit/4X1LECF6RT2DKR1BQH4NBTCP3.obj', mtl: 'item/first-aid-kit/4X1LECF6RT2DKR1BQH4NBTCP3.mtl', size: .5, shouldAdjustHeight: true })

export default class FirstAid extends GameObject {
  constructor({ energy = 50, ...rest } = {}) {
    super({ mesh, energy, ...rest })
    this.name = 'health'
  }
}