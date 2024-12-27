import { getMesh, putOnSolids, getSize } from '/core/helpers.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

const getScene = object => {
  if (!object.parent) return null
  if (object.parent.type === 'Scene') return object.parent
  return getScene(object.parent)
}

export default class GameObject {
  #solids = []

  constructor({ mesh, name, pos, color, solids, scale, rotateY, altitude = 0, energy = 100
  } = {}) {
    if (mesh.userData.animations)
      this.mesh = clone(mesh)
    else
      this.mesh = mesh.clone()

    this.name = name
    this.energy = this.maxEnergy = energy
    this.hitAmount = 0

    if (pos) this.position = pos

    if (solids) putOnSolids(this.mesh, solids, altitude)
    if (solids) this.addSolids(solids)

    if (scale) this.mesh.scale.set(scale, scale, scale)
    if (color != undefined) getMesh(this.mesh).material.color.setHex(color)
    if (rotateY) this.mesh.rotateY(rotateY)

    const { x, y, z } = getSize(this.mesh)
    this.width = x
    this.height = y
    this.depth = z
  }

  /* GETTERS & SETTERS */

  get solids() {
    return this.#solids
  }

  get name() {
    return this.mesh.name
  }

  set name(name) {
    this.mesh.name = name
  }

  get energy() {
    return this.mesh.userData.energy
  }

  set energy(newEnergy) {
    if (newEnergy < 0) this.mesh.userData.energy = 0
    else if (newEnergy > this.maxEnergy) this.mesh.userData.energy = this.maxEnergy
    else this.mesh.userData.energy = newEnergy
  }

  get hitAmount() {
    return this.mesh.userData.hitAmount
  }

  set hitAmount(hitAmount) {
    this.mesh.userData.hitAmount = hitAmount
  }

  get dead() {
    return this.mesh.userData.energy <= 0
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

  get playerMesh() {
    return this.scene?.getObjectByName('player')
  }

  /* UTILS */

  add(obj) {
    this.mesh.add(obj)
  }

  pushToSolids = obj => {
    if (obj !== this.mesh && !this.#solids.includes(obj))
      this.#solids.push(obj)
  }

  /**
   * Add solid objects to collide (terrain, walls, actors, etc.)
   * @param {array of meshes, mesh or meshes} newSolids
   */
  addSolids(...newSolids) {
    newSolids.forEach(newSolid => {
      if (Array.isArray(newSolid)) newSolid.forEach(this.pushToSolids)
      else this.pushToSolids(newSolid)
    })
  }

  distanceTo(mesh) {
    if (!mesh) return Infinity
    return this.position.distanceTo(mesh.position)
  }

  applyDamage() {
    this.energy -= this.hitAmount
    this.hitAmount = 0
  }

  checkHit() {
    if (this.hitAmount) this.applyDamage()
  }

  /* UPDATE */

  update() {
    this.checkHit()
  }
}
