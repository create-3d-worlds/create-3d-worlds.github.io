import * as THREE from 'three'

import GameObject from '/utils/actor/GameObject.js'
import config from '/config.js'

const material = new THREE.MeshPhongMaterial({ color: 0xffd700 })

function createCoin(radius = 1, depth = .2) {
  const geometry = new THREE.CylinderGeometry(radius, radius, depth)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.translateY(radius)
  mesh.rotation.x = Math.PI / 2

  return mesh
}

export default class Coin extends GameObject {
  constructor(param = {}) {
    super({ mesh: createCoin(), name: 'coin', ...param })
    this.mesh.rotateZ(Math.random() * Math.PI)
    this.audio = new Audio('/assets/sounds/fairy-arcade-sparkle.mp3')
    this.audio.volume = config.volume
  }

  playSound() {
    this.audio.currentTime = 0
    this.audio.play()
  }

  dispose() {
    super.dispose()
    this.playSound()
  }

  update(delta) {
    this.mesh.rotateZ(2 * delta)
  }
}