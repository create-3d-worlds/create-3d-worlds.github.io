import { getMesh, putOnSolids, getSize, getScene } from '/utils/helpers.js'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'

export default class GameObject {

  constructor({ mesh, name, pos, color, solids, scale, rotateY, altitude = 0, energy = 100
  } = {}) {
    if (mesh.userData.animations)
      this.mesh = clone(mesh)
    else
      this.mesh = mesh.clone()

    this.name = name
    this.energy = energy
    this.hitAmount = 0

    if (pos) this.position = pos
    if (solids) putOnSolids(this.mesh, solids, altitude)

    if (scale) this.mesh.scale.set(scale, scale, scale)
    if (color != undefined) getMesh(this.mesh).material.color.setHex(color)
    if (rotateY) this.mesh.rotateY(rotateY)

    const { x, y, z } = getSize(this.mesh)
    this.width = x
    this.height = y
    this.depth = z
  }

  /* GETTERS & SETTERS */

  get name() {
    return this.mesh.name
  }

  set name(name) {
    this.mesh.name = name
  }

  get energy() {
    return this.mesh.userData.energy
  }

  set energy(energy) {
    this.mesh.userData.energy = energy > 0 ? energy : 0
  }

  get hitAmount() {
    return this.mesh.userData.hitAmount
  }

  set hitAmount(hitAmount) {
    this.mesh.userData.hitAmount = hitAmount
  }

  get dead() {
    return this.energy <= 0
  }

  get position() {
    return this.mesh.position
  }

  set position(pos) {
    if (Array.isArray(pos))
      this.mesh.position.set(...pos)
    else
      this.mesh.position.copy(pos)
  }

  get scene() {
    return getScene(this.mesh)
  }

  get player() {
    return this.scene?.getObjectByName('player')
  }

  /* UTILS */

  add(obj) {
    this.mesh.add(obj)
  }

  distanceTo(mesh) {
    if (!mesh) return Infinity
    return this.position.distanceTo(mesh.position)
  }

  applyDamage() {
    this.energy -= this.hitAmount
    this.hitAmount = 0
  }
}
