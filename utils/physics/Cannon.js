import { loadModel } from '/utils/loaders.js'
import Vehicle from '/utils/physics/Vehicle.js'

const mesh = await loadModel({ file: 'weapon/cannon/mortar/mortar.obj', mtl: 'weapon/cannon/mortar/mortar.mtl', size: 1, angle: Math.PI * .5 })

export default class Cannon extends Vehicle {
  constructor(param = {}) {
    super({ mesh, defaultRadius: .18, wheelFront: { x: .3, y: .12, z: .32 }, wheelBack: { x: .3, y: .18, z: -.56 }, maxEngineForce: 20, mass: 100, ...param })
    this.chaseCamera.offset = [0, 1, -2.5]
    this.chaseCamera.lookAt = [0, 1, 0]
  }
}