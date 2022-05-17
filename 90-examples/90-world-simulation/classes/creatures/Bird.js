import * as THREE from '/node_modules/three108/build/three.module.js'
import Entity from '../Entity.js'
import {rndInt, roll} from '../../utils/helpers.js'

const birdJson = {
  id: 'idle', strategy: 'prioritised',
  children: [
    { id: 'explore', strategy: 'sequential',
      children: [
        {id: 'getRandomDestination'},
      ]
    }
  ]
}

const birdStates = {
  idle() {
    console.log('idle')
  },
  getRandomDestination() {
    const rndPoint = new THREE.Vector3(rndInt(1100), 30 + roll(50), rndInt(1100))
    this.destination = rndPoint
  },
  canExplore() {
    return Math.random() > 0.99
  }
}

export default class Bird extends Entity {
  constructor(model) {
    super(model)
    this.name = 'bird'
    this.health = 5
    this.speed = 50 + rndInt(40)
    this.mixer = null
    this.state = this.machine.generate(birdJson, this, birdStates)
    this.createMesh()
  }

  createMesh() {
    const {scene, animations} = this.model
    this.mesh = scene.clone()
    this.mesh.scale.set(.1, .1, .1)
    this.mesh.castShadow = true
    this.mesh.name = 'bird'
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.mixer.clipAction(animations[0]).play()
    this.mesh.position.copy(new THREE.Vector3(rndInt(1100), 60 + roll(50), rndInt(1100)))
  }

  update(delta) {
    this.state = this.state.tick()
    super.update(delta)
    if (this.mixer) this.mixer.update(delta)
  }

  attacked() {
    this.health -= roll(6)
    if (this.health <= 0) {
      this.speed = 0
      this.remove = true
    }
  }
}
