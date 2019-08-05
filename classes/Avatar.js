import {clock} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

export default class Avatar {
  constructor(x = 0, z = 0, scale = 0.2) {
    this.scale = scale
    this.speed = 1000 * scale

    this.createMesh()
    this.mesh.scale.set(scale, scale, scale)
    this.position.set(x, 150 * scale, z)
  }

  createMesh() {
    const texture = new THREE.MeshNormalMaterial()
    const body = new THREE.SphereGeometry(100)
    this.mesh = new THREE.Mesh(body, texture)

    const sphere = new THREE.SphereGeometry(50)
    this.rightHand = new THREE.Mesh(sphere, texture)
    this.rightHand.position.set(-150, 0, 0)
    this.add(this.rightHand)

    this.leftHand = new THREE.Mesh(sphere, texture)
    this.leftHand.position.set(150, 0, 0)
    this.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(sphere, texture)
    this.rightLeg.position.set(70, -120, 0)
    this.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(sphere, texture)
    this.leftLeg.position.set(-70, -120, 0)
    this.add(this.leftLeg)
  }

  checkKeys(delta) {
    const {mesh} = this
    const angle = Math.PI / 2 * delta // 90 degrees per second
    const distance = this.speed * delta // speed (in pixels) per second

    if (pressed.KeyW || pressed.ArrowUp) mesh.translateZ(-distance)
    if (pressed.KeyS || pressed.ArrowDown) mesh.translateZ(distance)
    if (pressed.KeyA) mesh.translateX(-distance)
    if (pressed.KeyD) mesh.translateX(distance)

    if (pressed.ArrowLeft) mesh.rotateY(angle)
    if (pressed.ArrowRight) mesh.rotateY(-angle)
    // if (pressed.ArrowUp) mesh.rotateX(angle)
    // if (pressed.ArrowDown) mesh.rotateX(-angle)
  }

  isCollide(objects) {
    const vec = new THREE.Vector3(0, -1, 0)
    const ray = new THREE.Raycaster(this.position, vec)
    const intersects = ray.intersectObjects(objects)
    if (intersects.length > 0) return true
    return false
  }

  respondCollision() {
    const bounce = 100 * this.scale
    if (pressed.KeyW || pressed.ArrowUp) this.position.z += bounce
    if (pressed.KeyS || pressed.ArrowDown) this.position.z -= bounce
    if (pressed.KeyA) this.position.x += bounce
    if (pressed.KeyD) this.position.x -= bounce
  }

  add(child) {
    this.mesh.add(child)
  }

  get position() {
    return this.mesh.position
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
