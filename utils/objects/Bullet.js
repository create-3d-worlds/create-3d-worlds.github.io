import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const sphereGeo = new THREE.SphereGeometry(.3)
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

export default class Bullet extends GameObject {
  constructor({ pos, damage = 100, damageDistance = 2 } = {}) {
    super({ mesh: sphere, pos })
    this.speed = .2
    this.maxRange = 500
    this.damageDistance = damageDistance
    this.damage = damage
    this.initPosition = pos.clone()
  }

  get outOfRange() {
    return this.position.distanceTo(this.initPosition) >= this.maxRange
  }

  addTarget() {
    const direction = new THREE.Vector3().subVectors(this.playerMesh.position, this.position).normalize()
    this.target = new THREE.Vector3().addVectors(this.position, direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    if (this.dead) return
    if (!this.target) this.addTarget()

    this.position.lerp(this.target, this.speed * delta)

    if (this.distanceTo(this.playerMesh) < this.damageDistance) {
      this.playerMesh.userData.hitAmount = this.damage
      this.energy = 0
    }

    if (this.outOfRange) this.energy = 0
  }
}
