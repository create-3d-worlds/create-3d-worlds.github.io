import * as THREE from '/node_modules/three/build/three.module.js'
import {keyboard, Kamenko} from '/classes/index.js'

const {pressed} = keyboard

/**
 * Player class handle user input, move mesh and call model animations.
 * @param ModelSubclass is used to create a `mesh`.
 * @param callback is used to pass `mesh` to the scene.
 */
export default class Player {
  constructor(x = 0, y = 0, z = 0, size = 35, callback, ModelSubclass) {
    this.size = size
    this.speed = size * 4
    this.grounds = []
    this.surroundings = []
    this.groundY = 0
    if (typeof callback === 'function')
      this.model = new ModelSubclass(mesh => {
        this.mesh = mesh
        mesh.position.set(x, y, z)
        callback(mesh)
      }, size)
    else {
      this.model = new Kamenko(size, callback)
      this.mesh = this.model.mesh
      this.mesh.position.set(x, y, z)
    }
  }

  /**
   * Check user input and move mesh
   */
  moveMesh(delta) {
    if (!this.mesh) return
    const step = this.speed * delta // speed (in pixels) per second
    const stepY = this.speed * delta * 2
    const angle = Math.PI / 2 * delta

    if (!pressed.Space) {
      if (this.position.y > this.groundY) this.mesh.translateY(-stepY)
      if (this.position.y < this.groundY) this.mesh.translateY(stepY)
    }
    if (pressed.KeyA || pressed.ArrowLeft) this.mesh.rotateY(angle)
    if (pressed.KeyD || pressed.ArrowRight) this.mesh.rotateY(-angle)

    if (this.directionBlocked()) return

    if (pressed.KeyW || pressed.ArrowUp) this.mesh.translateZ(-step)
    if (pressed.KeyS || pressed.ArrowDown) this.mesh.translateZ(step)
    if (pressed.KeyQ) this.mesh.translateX(-step)
    if (pressed.KeyE) this.mesh.translateX(step)
    if (pressed.Space) this.mesh.translateY(stepY)
  }

  /**
   * Check user input and call model animations
   */
  animateModel() {
    if (!keyboard.totalPressed)
      this.model.idle()
    else if (pressed.ShiftLeft && pressed.KeyW)
      this.model.squatWalk()
    else if (pressed.ShiftLeft)
      this.model.squat()
    else if (pressed.Space)
      this.model.jump()
    else if (pressed.KeyW || pressed.KeyS || pressed.KeyQ || pressed.KeyE || pressed.ArrowUp || pressed.ArrowDown)
      this.model.walk()
  }

  /**
   * Update ground level
   * @param {miliseconds} delta
   */
  findGround() {
    if (!this.mesh || !this.grounds.length) return
    const bodyTop = this.position.clone()
    bodyTop.y += this.size * 2
    const raycaster = new THREE.Raycaster(bodyTop, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObjects(this.grounds)
    if (intersects[0]) this.groundY = intersects[0].point.y
  }

  /**
   * Raycast in player movement direction
   */
  chooseRaycastVector() {
    if (pressed.Space && pressed.KeyW) return new THREE.Vector3(0, 1, -1)
    if (pressed.KeyW) return new THREE.Vector3(0, 0, -1)
    if (pressed.KeyS) return new THREE.Vector3(0, 0, 1)
    if (pressed.KeyA) return new THREE.Vector3(-1, 0, 0)
    if (pressed.KeyD) return new THREE.Vector3(1, 0, 0)
    if (pressed.Space) return new THREE.Vector3(0, 1, 0)
    return null
  }

  directionBlocked() {
    if (!this.mesh || !this.surroundings.length) return
    const vector = this.chooseRaycastVector()
    if (!vector) return false
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const bodyCenter = this.position.clone()
    bodyCenter.y += this.size
    const raycaster = new THREE.Raycaster(bodyCenter, direction, 0, this.size)
    const intersections = raycaster.intersectObjects(this.surroundings, true)
    return intersections.length > 0
  }

  get position() {
    return this.mesh.position
  }

  add(obj) {
    this.mesh.add(obj)
  }

  /**
   * Add solid objects for player to collide
   * @param {string} type grounds or surroundings
   * @param {any} solids mesh group, array or a single mesh
   */
  addSolid(type, ...solids) {
    solids.forEach(solid => {
      if (solid.children && solid.children.length) this[type].push(...solid.children)
      else if (solid.length) this[type].push(...solid)
      else this[type].push(solid)
    })
  }

  addGround(...grounds) {
    this.addSolid('grounds', ...grounds)
  }

  addSurrounding(...surroundings) {
    this.addSolid('surroundings', ...surroundings)
  }

  update(delta) {
    this.findGround(delta)
    this.moveMesh(delta)
    this.animateModel()
    if (this.model.update) this.model.update(delta)
  }
}
