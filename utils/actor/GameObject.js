import { getMesh, putOnSolids, getSize, getScene } from '/utils/helpers.js'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'

export default class GameObject {

  constructor({ mesh, name, pos, color, solids, scale, rotateY, altitude = 0 } = {}) {
    this.mesh = clone(mesh)
    this.name = name

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

  /* UTILS */

  add(obj) {
    this.mesh.add(obj)
  }

  dispose(mesh = this.mesh) {
    mesh.geometry.dispose()
    mesh.material.dispose()
    this.scene?.remove(mesh)
  }

  distanceTo(mesh) {
    return this.position.distanceTo(mesh.position)
  }
}
