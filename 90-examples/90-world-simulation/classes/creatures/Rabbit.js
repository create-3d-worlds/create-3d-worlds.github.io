import * as THREE from '/node_modules/three108/build/three.module.js'
import Entity from '../Entity.js'
import {rndInt, roll} from '../../utils/helpers.js'

const rabbitJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    { id: 'explore', strategy: 'sequential',
      children: [
        { id: 'getRandomDestination' }
      ]
    }
  ]
}

const rabbitStates = {
  idle() {
    console.log('idle')
  },
  getRandomDestination() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 10, rndInt(1100))
    this.destination = rndPoint
  },
  canExplore() {
    return Math.random() > 0.99 && !this.remove && this.health > 0
  }
}

export default class Rabbit extends Entity {
  constructor(model) {
    super(model)
    this.name = 'rabbit'
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.state = this.machine.generate(rabbitJson, this, rabbitStates)
    this.createMesh()
  }

  update(delta) {
    this.state = this.state.tick()
    super.update(delta)
  }

  createMesh() {
    const {scene} = this.model
    scene.castShadow = true
    const group = new THREE.Group()
    group.scale.set(.05, .05, .05)
    group.add(scene.clone())
    this.mesh = group
    this.mesh.name = 'rabbit'
  }

  attacked() {
    this.health -= roll(6)
    if (this.health <= 0) {
      this.speed = 0
      this.remove = true
    }
    this.speed = 140
  }
}
