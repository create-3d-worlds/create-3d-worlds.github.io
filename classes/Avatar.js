import {clock} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

export default class Avatar {
  constructor(x = 0, z = 0, scale = 0.2) {
    this.scale = scale
    const texture = new THREE.MeshNormalMaterial()
    const body = new THREE.SphereGeometry(100)
    this.mesh = new THREE.Mesh(body, texture)
    this.mesh.scale.set(scale, scale, scale)
    this.mesh.position.x = x
    this.mesh.position.z = z
    this.mesh.position.y = 150 * this.scale

    const sphere = new THREE.SphereGeometry(50)
    this.rightHand = new THREE.Mesh(sphere, texture)
    this.rightHand.position.set(-150, 0, 0)
    this.mesh.add(this.rightHand)

    this.leftHand = new THREE.Mesh(sphere, texture)
    this.leftHand.position.set(150, 0, 0)
    this.mesh.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(sphere, texture)
    this.rightLeg.position.set(70, -120, 0)
    this.mesh.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(sphere, texture)
    this.leftLeg.position.set(-70, -120, 0)
    this.mesh.add(this.leftLeg)
  }

  update() {
    this.updatePosition()
    this.updateWalk()
    // this.updateAngle()
  }

  updatePosition() {
    if (pressed.ArrowLeft) this.mesh.position.x -= 10 * this.scale
    if (pressed.ArrowRight) this.mesh.position.x += 10 * this.scale
    if (pressed.ArrowUp) this.mesh.position.z -= 10 * this.scale
    if (pressed.ArrowDown) this.mesh.position.z += 10 * this.scale
  }

  updateWalk() {
    if (!keyboard.arrowPressed) return
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  // fix updateAngle
  updateAngle() {
    let angle = Math.PI
    if (pressed.ArrowUp) angle = Math.PI
    if (pressed.ArrowDown) angle = 0
    if (pressed.ArrowRight) angle = Math.PI / 2
    if (pressed.ArrowLeft) angle = -Math.PI / 2
    this.mesh.rotation.y = angle
  }
}
