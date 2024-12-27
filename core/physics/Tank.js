import { mapRange } from '/core/helpers.js'
import { loadModel } from '/core/loaders.js'
import Vehicle from '/core/physics/Vehicle.js'
import { Smoke } from '/core/Particles.js'

const wheelFront = { x: .75, y: .1, z: 1.25 }
const wheelBack = { x: .75, y: .1, z: -1.25 }

const mesh = await loadModel({ file: 'tank/t-50/model.fbx', texture: 'metal/metal01.jpg' })

const smokeParam = { size: .5, num: 25, maxRadius: .22, color: 0xffffff, opacity: .5 }

export default class Tank extends Vehicle {
  constructor(param = {}) {
    super({ mesh, wheelFront, wheelBack, maxSpeed: 40, maxEngineForce: 1000, ...param })

    this.smokeLeft = this.createSmoke()
    this.smokeLeft.mesh.translateX(.4)
    this.smokeRight = this.createSmoke()
    this.smokeRight.mesh.translateX(-.4)
  }

  createSmoke() {
    const smoke = new Smoke(smokeParam)
    smoke.mesh.translateY(.5)
    smoke.mesh.translateZ(2.5)
    smoke.mesh.rotateX(-Math.PI * .5)
    this.mesh.add(smoke.mesh)
    return smoke
  }

  update(delta) {
    super.update(delta)

    const maxVelocity = mapRange(this.speed, 0, 30, 3, 8)
    const param = { delta, min: -1.25, minVelocity: maxVelocity / 2, maxVelocity, loop: this.input.keyPressed }

    this.smokeLeft.update(param)
    this.smokeRight.update(param)

    if (!this.input.controlsPressed) {
      this.smokeLeft.reset({ randomize: false, opacity: smokeParam.opacity })
      this.smokeRight.reset({ randomize: false, opacity: smokeParam.opacity })
    }
  }
}