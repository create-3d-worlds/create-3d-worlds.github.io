import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const sphereGeo = new THREE.SphereGeometry(.5)
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

class Bullet extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: sphere, pos })
    this.speed = .2
    this.maxRange = 1000
    this.initPosition = pos.clone()
  }

  addTarget() {
    const direction = new THREE.Vector3()
    direction.subVectors(this.player.position, this.position).normalize()

    this.target = new THREE.Vector3()
    this.target.addVectors(this.position, direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    if (!this.target) this.addTarget()

    this.position.lerp(this.target, this.speed * delta)

    if (this.position.distanceTo(this.initPosition) >= this.maxRange / 2) this.dispose()
  }
}

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

  update(delta) {
    if (this.targetInRange && this.timeToShoot) {
      this.addBullet()
      this.last = Date.now()
    }

    if (!this.targetInRange) this.removeBullets()

    this.bullets.forEach(bullet => {
      if (!bullet.mesh) this.removeBullet(bullet)
      bullet.update(delta)
    })
  }
}