import * as THREE from '/node_modules/three108/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { createPlayerBox } from '/utils/boxes.js'
import { addSolids, raycastGround } from '/classes/actions/index.js'
import { getHeight } from '/utils/helpers.js'

const { pressed } = keyboard
const { LoopOnce, LoopRepeat, Vector3, AnimationMixer } = THREE

const onGround = (playerY, groundY) => Math.abs(playerY) == Math.round(groundY)

/**
 * Player handles user input, move mesh and animate model.
 * (loadModel handles size and rotation)
 */
export default class Player {
  constructor({ transparent = false, mesh = createPlayerBox(2, transparent), speed, animations, animNames = {} } = {}) {
    this.mesh = mesh
    this.size = getHeight(mesh)
    this.speed = speed || this.size * 2 // TODO: da utiče na brzinu animacije
    this.solids = []
    this.groundY = 0
    // some animation not work in group
    this.mixer = new AnimationMixer(mesh.type === 'Group' ? mesh.children[0] : mesh)
    this.animNames = animNames
    this.animations = animations
    this.loopOncePressed = false
  }

  /* INPUT */

  handleInput(delta) {
    this.running = keyboard.capsLock
    const speed = this.running ? this.speed * 2 : this.speed
    this.step = speed * delta // speed in pixels per second
    this.jumpStep = speed * delta * 1.5
    this.turnAngle = Math.PI / 2 * delta

    if (!keyboard.keyPressed || this.loopOncePressed) this.idle()
    if (!pressed.Space) this.fall()

    if (!pressed.mouse && !pressed.mouse2) this.loopOncePressed = false //  && !pressed.Space (ako je jump once)

    if (keyboard.left) this.turn(1)
    if (keyboard.right) this.turn()

    if (pressed.mouse) this.attack()
    if (pressed.mouse2) this.special()

    if (this.directionBlocked()) return this.fall()

    if (pressed.Space) this.jump()

    if (keyboard.up) this.walk()
    if (keyboard.down) this.walk(1)
    if (pressed.KeyQ) this.sideWalk()
    if (pressed.KeyE) this.sideWalk(1)
  }

  /* MOVEMENTS */

  walk(dir = -1) {
    this.mesh.translateZ(this.step * dir)
    if (onGround(this.position.y, this.groundY)) this.walkAnim()
  }

  sideWalk(dir = -1) {
    this.mesh.translateX(this.step * dir)
    this.sideWalkAnim()
  }

  turn(dir = -1) {
    this.mesh.rotateY(this.turnAngle * dir)
  }

  fall() {
    if (Math.abs(this.position.y) == Math.round(this.groundY)) return // this.idle()
    if (this.position.y - this.jumpStep >= this.groundY) {
      this.mesh.translateY(-this.jumpStep)
      this.fallAnim()
    }
    if (this.position.y < this.groundY) this.mesh.translateY(this.jumpStep) // za neravne terene
  }

  jump() {
    this.mesh.translateY(this.jumpStep)
    this.jumpAnim()
  }

  /* ANIMATIONS */

  idle() {
    this.playAnimation(this.animNames.idle, LoopRepeat)
  }

  walkAnim() {
    const animation = this.running ? this.animNames.run : this.animNames.walk
    this.playAnimation(animation, LoopRepeat)
  }

  sideWalkAnim() {
    this.playAnimation(this.animNames.walk, LoopRepeat)
  }

  jumpAnim() {
    this.playAnimation(this.animNames.jump, LoopRepeat)
  }

  fallAnim() {
    this.playAnimation(this.animNames.fall || this.animNames.jump, LoopRepeat)
  }

  attack() {
    this.playAnimation(this.animNames.attack, LoopOnce)
  }

  special() {
    this.playAnimation(this.animNames.special, LoopOnce)
  }

  playAnimation(name, loop) {
    if (!this.animations || this.shouldNotPlay(name, loop)) return

    if (this.action) this.action.stop()
    const clip = this.animations.find(c => c.name == name)
    this.action = clip ? this.mixer.clipAction(clip) : this.action
    // if (!this.action) return
    this.action.setLoop(loop)
    this.action.play()
    if (loop == LoopOnce) this.loopOncePressed = true
  }

  shouldNotPlay(nextClip, nextLoop) {
    const { action } = this
    return action && (
      action._clip.name == nextClip || // don't start the same clip over again
      action.loop == LoopOnce && action.isRunning() || // wait one-time animation to finish
      nextLoop === LoopOnce && this.loopOncePressed // don't play one-time animations twice
    )
  }

  /* RAYCAST */

  chooseRaycastVector() {
    if (pressed.Space && keyboard.up) return new Vector3(0, 1, -1)
    if (keyboard.up) return new Vector3(0, 0, -1)
    if (keyboard.down) return new Vector3(0, 0, 1)
    if (pressed.KeyQ) return new Vector3(-1, 0, 0)
    if (pressed.KeyE) return new Vector3(1, 0, 0)
    if (pressed.Space) return new Vector3(0, 1, 0)
    return null
  }

  directionBlocked() {
    if (!this.mesh || !this.solids.length) return
    const vector = this.chooseRaycastVector()
    if (!vector) return false
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const bodyCenter = this.position.clone()
    bodyCenter.y += this.size
    const raycaster = new THREE.Raycaster(bodyCenter, direction, 0, this.size)
    const intersections = raycaster.intersectObjects(this.solids, true)
    return intersections.length > 0
  }

  /* GETTERS */

  get position() {
    return this.mesh.position
  }

  get x() {
    return this.mesh.position.x
  }

  get z() {
    return this.mesh.position.z
  }

  get angle() {
    const { rotation } = this.mesh
    const rotationY = rotation.x == 0 ? rotation.y : Math.PI - rotation.y
    return -rotationY - Math.PI * .5
  }

  add(obj) {
    this.mesh.add(obj)
  }

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  /* LOOP */

  updateGround() {
    this.groundY = raycastGround(this, { y: this.size * 2 })
  }

  update(delta) {
    this.updateGround()
    this.handleInput(delta)
    if (this.mixer) this.mixer.update(delta)
  }
}
