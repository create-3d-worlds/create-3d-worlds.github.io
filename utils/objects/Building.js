import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'

const { randFloat } = THREE.MathUtils

export default class Building extends GameObject {
  constructor({ name = 'building', energy = 150, ...rest } = {}) {
    super({ name, energy, ...rest })
    this.fireMin = randFloat(-8, -6)
    this.fireMax = randFloat(2, 4)
  }

  addFire() {
    const promise = import('/utils/Particles.js')
    promise.then(obj => {
      this.fire = Math.random() > .5 ? new obj.Fire() : new obj.BigSmoke()
      this.add(this.fire.mesh)
      this.fire.mesh.position.y += this.height * .5
      // this.fire.mesh.position.z -= this.depth * .5
    })
  }

  checkHit() {
    super.checkHit()

    if (this.energy <= 0 && !this.fire) this.addFire()
  }

  update(delta) {
    super.update()
    this.fire?.update({ delta, min: this.fireMin, max: this.fireMax })
  }
}