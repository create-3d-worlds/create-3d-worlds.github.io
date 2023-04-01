import { getMesh, putOnTerrain, addSolids } from '/utils/helpers.js'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'

export default class Entity {
  constructor({ mesh, name, pos, color, solids, scale, rotateY } = {}) {
    this.mesh = clone(mesh)
    this.name = name
    this.solids = []
    if (solids) {
      this.addSolids(solids)
      // this.putOnTerrain() // ako zeza ukloniti
    }
    if (pos) this.position = pos
    if (scale) this.mesh.scale.set(scale, scale, scale)
    if (color != undefined) getMesh(this.mesh).material.color.setHex(color)
    if (rotateY) this.mesh.rotateY(rotateY)
  }

  /* GETTERS & SETTERS */

  get name() {
    return this.mesh.name
  }

  set name(name) {
    this.mesh.name = name
  }

  get position() {
    return this.mesh.position
  }

  set position(pos) {
    this.mesh.position.copy(pos)
    this.putOnTerrain()
  }

  /* UTILS */

  add(obj) {
    this.mesh.add(obj)
  }

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  putOnTerrain() {
    putOnTerrain(this.mesh, this.solids)
  }
}
