import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'
import Bullet from './Bullet.js'

const mesh = await loadModel({
  file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj',
  mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl',
  size: 20,
  shouldAdjustHeight: true
})

export default class Tower extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.name = 'tower'
    this.range = 200
    this.bullets = []
    this.last = Date.now()
    this.interval = 500
  }

  get targetInRange() {
    return this.distanceTo(this.player) < this.range
  }

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  addBullet() {
    const pos = this.position.clone()
    pos.y += this.height
    const bullet = new Bullet({ pos })
    this.scene.add(bullet.mesh)
    this.bullets.push(bullet)
  }

  removeBullet(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1)
  }

  removeBullets() {
    this.bullets.forEach(bullet => bullet.dispose())
    this.bullets = []
  }

  checkHit() {
    if (!this.mesh.userData.hitAmount) return
    console.log('hit')

    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      const { Fire } = obj
      this.fire = new Fire()
      this.add(this.fire.mesh)
    })
  }

  update(delta) {
    this.checkHit()
    this.fire?.update()

    if (this.targetInRange && this.timeToShoot) {
      this.addBullet()
      this.last = Date.now()
    }

    if (!this.targetInRange) this.removeBullets()

    this.bullets.forEach(bullet => {
      if (!bullet.mesh.parent) this.removeBullet(bullet)
      bullet.update(delta)
    })
  }
}