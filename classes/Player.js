import * as THREE from '/node_modules/three119/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { createPlayerBox } from '/utils/boxes.js'
import { addSolids, raycastGround } from '/classes/actions/index.js'
import { getHeight, directionBlocked } from '/utils/helpers.js'
import { dir } from '/utils/constants.js'

const { pressed } = keyboard
const { LoopOnce, LoopRepeat, AnimationMixer } = THREE

/**
 * Handles user input, move mesh and animate model.
 * (loadModel handles size and rotation)
 */
export default class Player {
  constructor({ transparent = false, mesh = createPlayerBox(2, transparent), speed, animations, animNames = {} } = {}) {
    this.mesh = mesh
    this.size = getHeight(mesh)
    this.speed = speed || this.size * 2
    this.solids = []
    this.groundY = 0
    // some animation not work in group
    this.mixer = new AnimationMixer(mesh.type === 'Group' ? mesh.children[0] : mesh)
    this.animNames = animNames
    this.animations = animations
    this.loopOncePressed = false
  }

  inAir() {
    return this.position.y - this.groundY > this.size * .2
  }

  normalizeGround() {
    // za neravne terene
    if (this.position.y < this.groundY) this.mesh.translateY(this.jumpStep)
  }

  /* INPUT */

  handleInput(delta) {
    this.running = keyboard.capsLock
    const speed = this.running ? this.speed * 2 : this.speed
    this.step = speed * delta // speed in pixels per second
    this.jumpStep = speed * delta * 1.5
    this.turnAngle = Math.PI / 2 * delta
    this.loopOncePressed = pressed.mouse || pressed.mouse2 // pressed.Space (ako je jump once)

    this.normalizeGround()

    // BUG: kad je na vrhu drveta, ne može napred, samo levo-desno
    // http://127.0.0.1:8080/src/30-player/26-avatar-collision/
    if (this.inAir() && !pressed.Space) {
      if (keyboard.left) this.turn(1)
      if (keyboard.right) this.turn()
      return this.fall()
    }

    if (!keyboard.keyPressed || this.loopOncePressed)
      return this.idle()

    if (pressed.Space) {
      if (keyboard.up && this.directionBlocked(dir.upForward))
        return this.fall()

      if (keyboard.down && this.directionBlocked(dir.upBackward))
        return this.fall()

      if (this.directionBlocked(dir.up))
        return this.fall()

      if (keyboard.up) this.walk()
      if (keyboard.down) this.walk(1)
      if (keyboard.left) this.turn(1)
      if (keyboard.right) this.turn()
      return this.jump()
    }

    if (keyboard.left) return this.turn(1)
    if (keyboard.right) return this.turn()

    if (pressed.mouse) return this.attack()
    if (pressed.mouse2) return this.special()

    if (keyboard.up)
      if (!this.directionBlocked(dir.forward)) return this.walk()

    if (keyboard.down)
      if (!this.directionBlocked(dir.backward)) return this.walk(1)

    if (pressed.KeyQ)
      if (!this.directionBlocked(dir.left)) return this.sideWalk()

    if (pressed.KeyE)
      if (!this.directionBlocked(dir.right)) return this.sideWalk(1)
  }

  /* MOVEMENTS */

  walk(dir = -1) {
    this.mesh.translateZ(this.step * dir)
    // if (this.inAir()) return
    if (this.running && this.animNames.run) return this.runAnim()
    this.walkAnim()
  }

  sideWalk(dir = -1) {
    this.mesh.translateX(this.step * dir)
    this.sideWalkAnim()
  }

  turn(dir = -1) {
    this.mesh.rotateY(this.turnAngle * dir)
  }

  fall() {
    if (Math.round(this.position.y) == Math.round(this.groundY)) return

    if (this.position.y - this.jumpStep >= this.groundY) {
      this.mesh.translateY(-this.jumpStep)
      this.fallAnim()
    }
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
    this.playAnimation(this.animNames.walk, LoopRepeat)
  }

  runAnim() {
    this.playAnimation(this.animNames.run || this.animNames.walk, LoopRepeat)
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

  directionBlocked(vector) {
    return directionBlocked(this.mesh, this.solids, vector)
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
    // if no run animation, speed up walk animation
    const runDelta = (this.running && !this.animNames.run) ? delta * 2 : delta
    if (this.mixer) this.mixer.update(runDelta)
  }
}
