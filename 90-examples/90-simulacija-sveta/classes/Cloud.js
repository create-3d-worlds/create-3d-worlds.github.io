import * as THREE from '/node_modules/three108/build/three.module.js'
import Entity from './Entity.js'
import {rndInt, roll} from '../utils/helpers.js'

export default class Cloud extends Entity {
  constructor(model) {
    super(model)
    const position = new THREE.Vector3(rndInt(1200), 100 + rndInt(20), rndInt(1200))
    this.destination = new THREE.Vector3(1200, position.y, position.z)
    this.name = 'cloud'
    this.speed = 25
    this.createMesh(position)
  }

  createMesh(pos) {
    this.model.scale.set(roll(50) + 10, 15, roll(10) + 10)
    this.model.castShadow = true
    this.mesh = this.model.clone()
    this.mesh.name = 'cloud'
    this.mesh.position.copy(pos)
  }

  update(delta) {
    if (this.pos.x > 600) this.pos.x = -600
    super.update(delta)
  }
}
