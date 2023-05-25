import { loadModel } from '/utils/loaders.js'
import { addTexture } from '/utils/helpers.js'
import Vehicle from '/utils/physics/Vehicle.js'

const wheelFront = { x: .75, y: .1, z: 1.25 }
const wheelBack = { x: .75, y: .1, z: -1.25 }

const mesh = await loadModel({ file: 'tank/t-50/model.fbx' })

addTexture(mesh, 'metal/metal01.jpg')

export default class Tank extends Vehicle {
  constructor(param = {}) {
    super({ mesh, wheelFront, wheelBack, maxSpeed: 40, maxEngineForce: 500, ...param })
  }
}