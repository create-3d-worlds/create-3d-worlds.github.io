import * as THREE from 'three'
import GameObject from '/core/objects/GameObject.js'
import { getSize } from '/core/helpers.js'

const material = new THREE.MeshBasicMaterial({ color: 0x333333 })
const geometry = new THREE.CylinderGeometry(.4, .4, 2)
const mesh = new THREE.Mesh(geometry, material)
mesh.rotateX(Math.PI * .5)

export default class Missile extends GameObject {
  constructor({ pos, explosion } = {}) {
    super({ mesh, pos })
    this.speed = .2
    this.range = 300
    this.initPosition = pos.clone()
    this.explosion = explosion
  }

  get direction() {
    const position = new THREE.Vector3().addVectors(this.position, { x: 0, y: -50, z: -75 })
    return new THREE.Vector3().subVectors(position, this.position).normalize()
  }

  get target() {
    return new THREE.Vector3().addVectors(this.position, this.direction.multiplyScalar(this.range))
  }

  get enemies() {
    return [
      ...this.scene.getObjectsByProperty('name', 'building'),
      ...this.scene.getObjectsByProperty('name', 'factory'),
      ...this.scene.getObjectsByProperty('name', 'civil'),
      ...this.scene.getObjectsByProperty('name', 'tower'),
    ]
  }

  update(delta) {
    if (this.dead) return
    this.position.lerp(this.target, this.speed * delta)

    const raycaster = new THREE.Raycaster(this.position, this.direction, 0, 1)
    const intersects = raycaster.intersectObject(this.scene)

    this.enemies.forEach(mesh => {
      if (this.distanceTo(mesh) < getSize(mesh, 'x')) {
        if (mesh.userData.energy <= 0) return
        mesh.userData.hitAmount = 1000
      }
    })

    if (intersects.length) {
      const { point } = intersects[0]
      this.explosion.reset({ pos: point, unitAngle: 0.2 })
      this.energy = 0
    }
  }
}
