import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'

const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const sphereGeo = new THREE.SphereGeometry(.2)
const sphere = new THREE.Mesh(sphereGeo, sphereMaterial)

export default class Bullet extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: sphere, pos })
    this.speed = .2
    this.maxRange = 500
    this.initPosition = pos.clone()
  }

  addTarget() {
    const direction = new THREE.Vector3().subVectors(this.player.position, this.position).normalize()
    this.target = new THREE.Vector3().addVectors(this.position, direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    if (!this.target) this.addTarget()

    this.position.lerp(this.target, this.speed * delta)

    if (this.position.distanceTo(this.initPosition) >= this.maxRange) this.dispose()
  }
}
