import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj', mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl', size: 20, shouldAdjustHeight: true })

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const sphereGeo = new THREE.SphereGeometry(.5)
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

class Bullet extends GameObject {
  constructor() {
    super({ mesh: sphere })
    this.speed = 1
  }

  update(delta) {
    this.position.lerp(this.player.position, this.speed * delta)
  }
}

export default class Tower extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
    this.range = 200
    this.bullets = []
  }

  addBullet() {
    const bullet = new Bullet()
    this.scene.add(bullet.mesh)
    this.bullets.push(bullet)
  }

  update(delta) {
    if (this.distanceTo(this.player) < this.range)
      this.addBullet()
    // praviti pauzu

    this.bullets.forEach(bullet => bullet.update(delta))
  }
}