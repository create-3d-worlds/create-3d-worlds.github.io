import GameObject from '/utils/objects/GameObject.js'

export default class Building extends GameObject {
  constructor({ name = 'building', ...rest } = {}) {
    super({ name, ...rest })
  }

  checkHit() {
    if (!this.hitAmount) return

    this.energy -= this.hitAmount
    this.hitAmount = 0

    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      this.fire = new obj.Fire()
      this.add(this.fire.mesh)
      this.fire.mesh.position.y += this.height * .5
    })
  }

  update(delta) {
    this.checkHit()
    this.fire?.update({ delta })
  }
}