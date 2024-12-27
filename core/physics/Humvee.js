import { mapRange } from '/core/helpers.js'
import { loadModel } from '/core/loaders.js'
import Vehicle from '/core/physics/Vehicle.js'
import { Smoke } from '/core/Particles.js'

const mesh = await loadModel({ file: 'vehicle/ready/humvee/hummer.obj', mtl: 'vehicle/ready/humvee/hummer.mtl' })
const wheelMesh = await loadModel({ file: 'vehicle/ready/humvee/hummerTire.obj', mtl: 'vehicle/ready/humvee/hummerTire.mtl' })

const wheelFront = { x: 1.15, y: .15, z: 1.55 }
const wheelBack = { x: 1.15, y: .15, z: -1.8 }

const smokeParam = { size: .5, num: 25, maxRadius: .22, color: 0xffffff, opacity: .25 }

export default class Humvee extends Vehicle {
  constructor(param = {}) {
    super({ mesh, wheelFront, wheelBack, wheelMesh, mass: 1200, maxEngineForce: 2600, ...param })
    this.smoke = new Smoke(smokeParam)
    this.smoke.mesh.translateY(-1.75)
    this.smoke.mesh.translateX(1.2)
    this.smoke.mesh.translateZ(1.75)
    this.mesh.add(this.smoke.mesh)
  }

  update(delta) {
    super.update(delta)

    const maxVelocity = mapRange(this.speed, 0, 30, 3, 8)
    const param = { delta, min: -1.25, minVelocity: maxVelocity / 2, maxVelocity, loop: this.input.keyPressed }
    this.smoke.update(param)

    if (!this.input.controlsPressed)
      this.smoke.reset({ randomize: false, opacity: smokeParam.opacity })

  }
}