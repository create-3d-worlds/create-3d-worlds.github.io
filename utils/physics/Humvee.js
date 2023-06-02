import { loadModel } from '/utils/loaders.js'
import Vehicle from '/utils/physics/Vehicle.js'

const mesh = await loadModel({ file: 'vehicle/ready/humvee/hummer.obj', mtl: 'vehicle/ready/humvee/hummer.mtl' })
const wheelMesh = await loadModel({ file: 'vehicle/ready/humvee/hummerTire.obj', mtl: 'vehicle/ready/humvee/hummerTire.mtl' })

const wheelFront = { x: 1.15, y: .15, z: 1.55 }
const wheelBack = { x: 1.15, y: .15, z: -1.8 }

export default class Humvee extends Vehicle {
  constructor(param = {}) {
    super({ mesh, wheelFront, wheelBack, wheelMesh, mass: 1200, maxEngineForce: 2600, ...param })
  }
}