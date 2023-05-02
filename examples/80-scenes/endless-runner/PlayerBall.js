import * as THREE from 'three'
import input from '/utils/io/Input.js'
import { createBall } from '/utils/geometry.js'

const lanes = [-1, 0, 1]
const gravity = 0.007

export default class PlayerBall {
  constructor({ heroRadius = 0.2, heroBaseY = 1.8, heroSpeed = 4, worldSpeed, worldRadius } = {}) {
    this.heroRadius = heroRadius
    this.heroBaseY = heroBaseY
    this.worldSpeed = worldSpeed
    this.worldRadius = worldRadius
    this.heroSpeed = heroSpeed
    this.jumping = false
    this.bounceValue = 0.1
    this.laneIndex = 1

    this.mesh = createBall({ r: heroRadius })
    this.mesh.position.set(lanes[this.laneIndex], heroBaseY, 4.8)
  }

  jump(val) {
    this.jumping = true
    this.bounceValue = val
  }

  handleInput() {
    if (this.jumping) return

    if (input.left && this.laneIndex > 0) {
      this.laneIndex--
      this.jump(0.05)
    }
    if (input.right && this.laneIndex < 2) {
      this.laneIndex++
      this.jump(0.05)
    }
    if (input.up || input.pressed.Space)
      this.jump(0.1)
  }

  updateMesh(delta) {
    const heroRotation = (this.worldSpeed * this.worldRadius / this.heroRadius) / 5
    this.mesh.rotation.x -= heroRotation
    if (this.mesh.position.y <= this.heroBaseY) {
      this.jumping = false
      this.bounceValue = Math.random() * 0.04 + 0.005
    }
    this.mesh.position.y += this.bounceValue
    this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, lanes[this.laneIndex], this.heroSpeed * delta)
    this.bounceValue -= gravity
  }

  update(delta) {
    this.handleInput()
    this.updateMesh(delta)
  }

}
