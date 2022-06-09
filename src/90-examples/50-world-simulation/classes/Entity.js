import * as THREE from '/node_modules/three127/build/three.module.js'
import Machine from '../libs/Machine.js'
import { rndInt } from '../utils/helpers.js'

export default class Entity {
  constructor(model) {
    this.model = model
    if (model) this.mesh = model.clone()
    this.destination = new THREE.Vector3(rndInt(1100), 0, rndInt(1100))
    this.vel = new THREE.Vector3(0, 0, 0)
    this.rotation = new THREE.Euler(0, 0, 0)
    this.machine = new Machine()
    this.timeMult = 1
    this.speed = 0
    this.remove = false
    this.shadow = false
    this.state = null
  }

  get pos() {
    return this.mesh.position
  }

  update(delta) {
    const deltaX = this.destination.x - this.mesh.position.x
    const deltaZ = this.destination.z - this.mesh.position.z
    this.mesh.rotation.y = (Math.atan2(deltaX, deltaZ))

    const dv = new THREE.Vector3()
    dv.subVectors(this.destination, this.mesh.position)
    dv.multiplyScalar(this.speed * .001)
    this.vel = dv

    this.mesh.position.x += this.vel.x * delta * this.timeMult
    this.mesh.position.y += this.vel.y * delta * this.timeMult
    this.mesh.position.z += this.vel.z * delta * this.timeMult

    if (this.mixer) this.mixer.update(delta)
  }
}
