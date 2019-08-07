import {clock} from '../utils/three-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

const size = 150

export default class Avatar {
  constructor(x = 0, z = 0, scale = 0.2) {
    this.scale = scale
    this.speed = 1000 * scale
    this.createMesh()
    this.mesh.scale.set(scale, scale, scale)
    this.position.set(x, size * scale, z)
  }

  createMesh() {
    const texture = new THREE.MeshNormalMaterial()
    const body = new THREE.SphereGeometry(size * 2 / 3)
    this.mesh = new THREE.Mesh(body, texture)

    const sphere = new THREE.SphereGeometry(size / 3)
    this.rightHand = new THREE.Mesh(sphere, texture)
    this.rightHand.position.set(-size, 0, 0)
    this.add(this.rightHand)

    this.leftHand = new THREE.Mesh(sphere, texture)
    this.leftHand.position.set(size, 0, 0)
    this.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(sphere, texture)
    this.rightLeg.position.set(size / 2, -size * 4 / 5, 0)
    this.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(sphere, texture)
    this.leftLeg.position.set(-size / 2, -size * 4 / 5, 0)
    this.add(this.leftLeg)
  }

  checkKeys(delta, solids) {
    if (!keyboard.totalPressed) return

    const angle = Math.PI / 2 * delta
    if (pressed.ArrowLeft) this.mesh.rotateY(angle)
    if (pressed.ArrowRight) this.mesh.rotateY(-angle)

    if (solids && this.isCollide(solids)) return

    const distance = this.speed * delta // speed (in pixels) per second
    if (pressed.KeyW || pressed.ArrowUp) this.mesh.translateZ(-distance)
    if (pressed.KeyS || pressed.ArrowDown) this.mesh.translateZ(distance)
    if (pressed.KeyA) this.mesh.translateX(-distance)
    if (pressed.KeyD) this.mesh.translateX(distance)
  }

  chooseRaycastVector() {
    // TODO: dodati zrak za medjuuglove, kada su pritisnute dve tipke
    if (pressed.KeyW || pressed.ArrowUp) return new THREE.Vector3(0, 0, -1)
    if (pressed.KeyS || pressed.ArrowDown) return new THREE.Vector3(0, 0, 1)
    if (pressed.KeyA) return new THREE.Vector3(-1, 0, 0)
    if (pressed.KeyD) return new THREE.Vector3(1, 0, 0)
    return null
  }

  isCollide(objects) {
    const vec = this.chooseRaycastVector()
    if (!vec) return false
    const direction = vec.applyQuaternion(this.mesh.quaternion)
    const raycaster = new THREE.Raycaster(this.position, direction, 0, size * this.scale)
    const intersections = raycaster.intersectObjects(objects, true)
    return intersections.length > 0
  }

  add(child) {
    this.mesh.add(child)
  }

  get position() {
    return this.mesh.position
  }

  get rotation() {
    return this.mesh.rotation
  }

  animate() {
    if (!keyboard.totalPressed) return
    const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  updatePositionY(terrain) {
    const raycaster = new THREE.Raycaster()
    raycaster.set(this.position, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObject(terrain)
    if (intersects[0]) this.position.y = intersects[0].point.y + size * this.scale
  }

  /* 
    @param solids: array of meshes (optional)
    @param terrain: mesh (optional)
  */
  update(delta, solids, terrain) {
    this.checkKeys(delta, solids, terrain)
    if (terrain) this.updatePositionY(terrain)
    this.animate()
  }
}
