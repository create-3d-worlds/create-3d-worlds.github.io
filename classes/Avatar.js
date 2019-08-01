import {clock} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

function isMoving() {
  return pressed.ArrowRight || pressed.ArrowLeft || pressed.ArrowDown || pressed.ArrowUp
}

export default class Avatar {
  constructor() {
    const texture = new THREE.MeshNormalMaterial()
    const body = new THREE.SphereGeometry(100)
    this.mesh = new THREE.Mesh(body, texture)

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
    this.updateWalk()
    this.updateAngle()
  }

  updateWalk() {
    if (!isMoving()) return
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  updateAngle() {
    let angle = Math.PI
    if (pressed.ArrowUp) angle = Math.PI
    if (pressed.ArrowDown) angle = 0
    if (pressed.ArrowRight) angle = Math.PI / 2
    if (pressed.ArrowLeft) angle = -Math.PI / 2
    this.mesh.rotation.y = angle
  }
}
