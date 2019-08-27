
import {keyboard, Model} from '../classes/index.js'

const {pressed} = keyboard

/**
 * Player class, handle keyboard input, move mesh and call model animations.
 * `Model` class should have `mesh` property and animate methods
 */
export default class Player {
  constructor(x = 0, y = 0, z = 0, size = 35, onLoad) {
    this.size = size
    this.speed = size * 4
    this.grounds = []
    this.surroundings = []
    this.groundY = 0
    this.model = new Model(mesh => {
      this.mesh = mesh
      mesh.position.set(x, y, z)
      onLoad(mesh)
    })
  }

  /**
   * Check user input and move mesh
   */
  move(delta) {
    if (!keyboard.totalPressed) return
    const {mesh} = this.model
    if (!mesh)return

    const angle = Math.PI / 2 * delta
    if (pressed.KeyA) mesh.rotateY(angle)
    if (pressed.KeyD) mesh.rotateY(-angle)

    if (this.surroundings.length && this.isCollide(this.surroundings)) return

    const distance = this.speed * delta // speed (in pixels) per second
    if (pressed.KeyW) mesh.translateZ(-distance)
    if (pressed.KeyS) mesh.translateZ(distance)
    if (pressed.KeyQ) mesh.translateX(-distance)
    if (pressed.KeyE) mesh.translateX(distance)

    if (pressed.Space) mesh.translateY(distance * 4)
  }

  /**
   * Check user input and call model animations
   */
  animate() {
    if (!keyboard.totalPressed) return this.model.idle()

    if (pressed.KeyW || pressed.KeyS || pressed.KeyQ || pressed.KeyE)
      this.model.walk()

    if (pressed.Space) this.model.jump()
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

  isCollide(solids) {
    if (!this.mesh) return
    const vector = this.chooseRaycastVector()
    if (!vector) return false
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const bodyCenter = this.position.clone()
    bodyCenter.y += this.size
    const raycaster = new THREE.Raycaster(bodyCenter, direction, 0, this.size)
    const intersections = raycaster.intersectObjects(solids, true)
    return intersections.length > 0
  }

  get position() {
    return this.mesh.position
  }

  /**
   * Check ground level and simulate gravity
   * @param {miliseconds} delta
   */
  checkGround(delta) {
    if (!this.mesh) return
    const gravity = this.speed * delta * 4
    if (!pressed.Space) this.mesh.translateY(-gravity)

    if (this.grounds.length) {
      const bodyTop = this.position.clone()
      bodyTop.y += this.size * 2
      const raycaster = new THREE.Raycaster(bodyTop, new THREE.Vector3(0, -1, 0))
      const intersects = raycaster.intersectObjects(this.grounds)
      if (intersects[0]) this.groundY = intersects[0].point.y
    }

    if (this.position.y < this.groundY) this.position.y = this.groundY
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
    this.checkGround(delta)
    this.move(delta)
    this.animate()
    this.model.update(delta)
  }
}
