import * as THREE from '/node_modules/three127/build/three.module.js'

import Entity from './Entity.js'
import {rndInt, roll} from '../utils/helpers.js'

export default class Arrow extends Entity {
  constructor(data) {
    super()
    const offset = data.offset || 10
    const randomOffset = new THREE.Vector3(rndInt(offset), roll(offset), rndInt(offset))
    this.name = 'arrow'
    this.destination = data.destination.add(randomOffset)
    this.speed = data.speed || 600
    this.lifeSpan = data.lifeSpan || 150
    this.createMesh(data.pos)
  }

  update(delta) {
    this.lifeSpan--
    this.speed--
    if (this.lifeSpan <= 0) {
      this.speed = 0
      this.remove = true
    }
    super.update(delta)
  }

  createMesh(pos) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 5)
    const material = new THREE.MeshLambertMaterial({ color: 0x966f33 })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.mesh.position.copy(pos)
  }
}
