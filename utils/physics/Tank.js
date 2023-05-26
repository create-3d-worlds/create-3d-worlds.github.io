import { addTexture, mapRange } from '/utils/helpers.js'
import { loadModel } from '/utils/loaders.js'
import Vehicle from '/utils/physics/Vehicle.js'
import { Smoke } from '/utils/Particles.js'

const wheelFront = { x: .75, y: .1, z: 1.25 }
const wheelBack = { x: .75, y: .1, z: -1.25 }

const mesh = await loadModel({ file: 'tank/t-50/model.fbx' })

addTexture(mesh, 'metal/metal01.jpg')

export default class Tank extends Vehicle {
  constructor(param = {}) {
    super({ mesh, wheelFront, wheelBack, maxSpeed: 40, maxEngineForce: 1000, ...param })

    this.particles = new Smoke({ size: .5, num: 25, maxRadius: .2, color: 0xffffff, opacity: .5 })
    this.particles.mesh.translateY(.5)
    this.particles.mesh.translateZ(2.5)
    this.particles.mesh.rotateX(-Math.PI * .5)
    this.mesh.add(this.particles.mesh)
  }

  update(delta) {
    super.update(delta)

    const maxVelocity = mapRange(this.speed, 0, 30, 3, 8)
    this.particles.update({ delta, min: -1.5, minVelocity: maxVelocity / 2, maxVelocity, loop: this.input.keyPressed })

    if (!this.input.keyPressed) this.particles.reset({ randomize: false })
  }
}