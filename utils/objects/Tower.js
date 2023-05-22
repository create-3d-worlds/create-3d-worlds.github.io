import { loadModel } from '/utils/loaders.js'
import Bullet from './Bullet.js'
import Building from './Building.js'

const mesh = await loadModel({
  file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj',
  mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl',
  size: 18,
  shouldAdjustHeight: true
})

export default class Tower extends Building {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.range = 200
    this.bullets = []
    this.last = Date.now()
    this.interval = 500
  }

  get targetInRange() {
    if (!this.player) return false
    return !this.player.userData.dead && this.distanceTo(this.player) < this.range
  }

  get ableToShoot() {
    return !this.dead && Date.now() - this.last >= this.interval
  }

  addBullet() {
    const pos = this.position.clone()
    pos.y += this.height
    const bullet = new Bullet({ pos })
    this.scene.add(bullet.mesh)
    this.bullets.push(bullet)
  }

  removeBullet(bullet) {
    this.scene.remove(bullet.mesh)
    this.bullets.splice(this.bullets.indexOf(bullet), 1)
  }

  removeBullets() {
    this.bullets.forEach(bullet => this.scene?.remove(bullet.mesh))
    this.bullets = []
  }

  update(delta) {
    super.update(delta)

    if (this.targetInRange && this.ableToShoot) {
      this.addBullet()
      this.last = Date.now()
    }

    if (!this.targetInRange) this.removeBullets()

    this.bullets.forEach(bullet => {
      if (bullet.dead) this.removeBullet(bullet)
      bullet.update(delta)
    })
  }
}