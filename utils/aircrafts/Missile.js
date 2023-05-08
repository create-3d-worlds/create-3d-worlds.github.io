import * as THREE from 'three'
import GameObject from '/utils/objects/GameObject.js'

const material = new THREE.MeshBasicMaterial({ color: 0x333333 })
const geometry = new THREE.CylinderGeometry(.5, .5, 2)
const cylinder = new THREE.Mesh(geometry, material)
cylinder.rotateX(Math.PI * .5)

export default class Missile extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: cylinder, pos })
    this.speed = .2
    this.maxRange = 300
    this.initPosition = pos.clone()
  }

  get target() {
    const position = new THREE.Vector3().addVectors(this.position, { x: 0, y: -50, z: -100 })
    const direction = new THREE.Vector3().subVectors(position, this.position).normalize()
    return new THREE.Vector3().addVectors(this.position, direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    this.position.lerp(this.target, this.speed * delta)

    if (this.position.y < 0) this.dispose()
  }
}
