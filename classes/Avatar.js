import {clock} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

export default class Avatar {
  constructor(x = 0, z = 0, scale = 0.2) {
    this.scale = scale
    this.speed = 1000 * scale

    this.createMesh()
    this.mesh.scale.set(scale, scale, scale)
    this.mesh.position.set(x, 150 * scale, z)
  }

  createMesh() {
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

  checkKeys(delta) {
    const {mesh} = this
    const angle = Math.PI / 2 * delta // 90 degrees per second
    const distance = this.speed * delta

    if (pressed.KeyW) mesh.translateZ(-distance)
    if (pressed.KeyS) mesh.translateZ(distance)
    if (pressed.KeyA) mesh.translateX(-distance)
    if (pressed.KeyD) mesh.translateX(distance)

    if (pressed.ArrowLeft) mesh.rotateY(angle)
    if (pressed.ArrowRight) mesh.rotateY(-angle)
    // problem: how to reset to zero
    if (pressed.ArrowUp) mesh.rotateX(angle)
    if (pressed.ArrowDown) mesh.rotateX(-angle)
  }

  animate() {
    if (!keyboard.totalPressed) return
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  update(delta) {
    this.checkKeys(delta)
    this.animate()
  }
}
