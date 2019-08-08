/* global TWEEN */
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

  // separate helper
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
    if (pressed.Space) this.jump(distance * 20)
  }

  chooseRaycastVector() {
    // TODO: dodati zrak za medjuuglove, kada su pritisnute dve tipke
    if (pressed.KeyW || pressed.ArrowUp) return new THREE.Vector3(0, 0, -1)
    if (pressed.KeyS || pressed.ArrowDown) return new THREE.Vector3(0, 0, 1)
    if (pressed.KeyA) return new THREE.Vector3(-1, 0, 0)
    if (pressed.KeyD) return new THREE.Vector3(1, 0, 0)
    if (pressed.Space) return new THREE.Vector3(0, 1, 0)
    return null
  }

  getIntersections(objects) {
    const vector = this.chooseRaycastVector()
    if (!vector) return null
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const raycaster = new THREE.Raycaster(this.position, direction, 0, size * this.scale)
    return raycaster.intersectObjects(objects, true)
  }

  isCollide(objects) {
    const intersections = this.getIntersections(objects)
    return intersections && intersections.length > 0
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

  backToEarth(terrain) {
    // if (jumping) return
    const raycaster = new THREE.Raycaster()
    raycaster.set(this.position, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObject(terrain)
    if (intersects[0]) this.position.y = intersects[0].point.y + size * this.scale
  }

  jump(distance) {
    const up = { y: this.position.y + distance }
    const down = { y: this.position.y }
    const current = { y: this.position.y }
    // jumping = true

    const jumpUp = new TWEEN.Tween(current)
      .to(up, 200)
      .onUpdate(() => {
        this.position.y = current.y
      })

    const jumpDown = new TWEEN.Tween(current)
      .to(down, 200)
      .onUpdate(() => {
        this.position.y = current.y
      })
      .onComplete(() => {
        // jumping = false
      })

    jumpUp.chain(jumpDown)
    jumpUp.start()
  }

  /*
    @param solids: array of meshes (optional)
    @param terrain: mesh (optional)
  */
  update(delta, solids, terrain) {
    this.checkKeys(delta, solids, terrain)
    if (terrain) this.backToEarth(terrain)
    // this.animate()
    TWEEN.update()
  }
}
