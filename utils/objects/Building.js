import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'

const { randFloat } = THREE.MathUtils

export default class Building extends GameObject {
  constructor({ name = 'building', energy = 150, randomSmoke = false, ...rest } = {}) {
    super({ name, energy, ...rest })
    this.fireMin = randFloat(-this.height, -this.height * .75)
    this.randomSmoke = randomSmoke
  }

  addFire() {
    if (this.fire) return
    const promise = import('/utils/Particles.js')
    promise.then(obj => {
      this.fire = (this.randomSmoke && Math.random() > .5) ? new obj.BigSmoke() : new obj.Fire()
      this.add(this.fire.mesh)
      this.fire.mesh.position.y += this.height * .5
    })
  }

  checkHit() {
    super.checkHit()

    if (this.energy <= 0 && !this.fire) this.addFire()
  }

  update(delta) {
    super.update()
    this.fire?.update({ delta, min: this.fireMin, max: 0 })
  }
}