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

  get direction() {
    const position = new THREE.Vector3().addVectors(this.position, { x: 0, y: -50, z: -100 })
    return new THREE.Vector3().subVectors(position, this.position).normalize()
  }

  get target() {
    return new THREE.Vector3().addVectors(this.position, this.direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    this.position.lerp(this.target, this.speed * delta)

    // TODO: dispose on collision
    if (this.position.y < 0) return this.dispose()

    const raycaster = new THREE.Raycaster(this.position, this.direction, 0, 1)
    const intersects = raycaster.intersectObject(this.scene)
    // TODO: explosion at point
    console.log(intersects[0]?.object, intersects[0]?.point)
  }
}
