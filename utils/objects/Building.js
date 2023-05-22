import GameObject from '/utils/objects/GameObject.js'

export default class Building extends GameObject {
  constructor(params = {}) {
    super(params)
    this.name = 'building'
    this.dead = false
  }

  checkHit() {
    if (!this.mesh.userData.hitAmount) return

    this.dead = true

    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      const { Fire } = obj
      this.fire = new Fire({ num: 5 })
      this.add(this.fire.mesh)
      this.fire.mesh.position.y += this.height * .5
    })
  }

  update(delta) {
    this.checkHit()
    this.fire?.update({ delta, minVelocity: .05, maxVelocity: .15 })
  }
}