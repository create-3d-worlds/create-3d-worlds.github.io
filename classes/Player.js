import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { createPlayerBox } from '/utils/boxes.js'
import { addSolids, raycastGround } from '/classes/actions/index.js'
import { getHeight, directionBlocked, cameraFollowObject } from '/utils/helpers.js'
import { dir } from '/utils/constants.js'
import { camera, createOrbitControls } from '/utils/scene.js'

const { pressed } = keyboard
const { LoopOnce, LoopRepeat, AnimationMixer } = THREE

/**
 * Handles user input, move mesh and animate model.
 * (loadModel handles size and rotation)
 */
export default class Player {
  constructor({ x = 0, y = 0, z = 0, mesh = createPlayerBox({ size: 2 }), autoCamera = true, speed, animations, animNames = {} } = {}) {
    this.mesh = mesh
    this.mesh.position.set(x, y, z)
    this.size = getHeight(mesh)
    this.speed = speed || this.size * 2
    this.solids = []
    this.groundY = 0
    // some animation not work in group
    this.mixer = new AnimationMixer(mesh.type === 'Group' ? mesh.children[0] : mesh)
    this.animNames = animNames
    this.animations = animations
    this.loopOncePressed = false
    if (autoCamera) this.controls = createOrbitControls()
  }

  inAir(step = this.size * .2) {
    return this.position.y - this.groundY > step
  }

  normalizeGround(jumpStep) {
    const difference = () => this.position.y - this.groundY // need current value, not variable
    if (!difference()) return
    if (difference() < 0) this.mesh.translateY(jumpStep)
    if (difference() > 0 && difference() < jumpStep) this.position.y = this.groundY
  }

  /* INPUT */

  handleInput(delta) {
    this.running = keyboard.capsLock
    const speed = this.running ? this.speed * 2 : this.speed
    this.step = speed * delta // speed in pixels per second
    this.jumpStep = speed * delta * 1.5
    this.turnAngle = Math.PI / 2 * delta
    this.loopOncePressed = pressed.mouse || pressed.mouse2 // || pressed.Space (ako je jump once)

    this.normalizeGround(this.jumpStep)

    if (this.inAir(this.jumpStep) && !pressed.Space) {
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

  idle() {
    this.playAnimation(this.animNames.idle, LoopRepeat)
  }

  walk(dir = -1) {
    this.mesh.translateZ(this.step * dir)
    if (this.running && this.animNames.run)
      return this.playAnimation(this.animNames.run || this.animNames.walk, LoopRepeat)
    this.playAnimation(this.animNames.walk, LoopRepeat)
  }

  sideWalk(dir = -1) {
    this.mesh.translateX(this.step * dir)
    this.playAnimation(this.animNames.walk, LoopRepeat)
  }

  turn(dir = -1) {
    this.mesh.rotateY(this.turnAngle * dir)
  }

  fall() {
    if (this.position.y == this.groundY) return

    if (this.position.y - this.jumpStep >= this.groundY) {
      this.mesh.translateY(-this.jumpStep)
      this.playAnimation(this.animNames.fall || this.animNames.jump, LoopRepeat)
    }
  }

  jump() {
    this.mesh.translateY(this.jumpStep)
    this.playAnimation(this.animNames.jump, LoopRepeat)
  }

  attack() {
    this.playAnimation(this.animNames.attack, LoopOnce)
  }

  special() {
    this.playAnimation(this.animNames.special, LoopOnce)
  }

  /* ANIMATIONS */

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

  /* ALIASES */

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  directionBlocked(vector) {
    return directionBlocked(this.mesh, this.solids, vector)
  }

  /* LOOP */

  updateGround() {
    this.groundY = raycastGround(this, { y: this.size * 2 })
  }

  update(delta) {
    this.updateGround()
    this.handleInput(delta)

    if (this.controls) {
      this.controls.target = this.mesh.position
      this.controls.update()
      if (!keyboard.pressed.mouse)
        cameraFollowObject(camera, this.mesh, { distance: this.size * 2, y: this.size * .75 })
    }

    const runDelta = (this.running && !this.animNames.run) ? delta * 2 : delta
    if (this.mixer) this.mixer.update(runDelta)
  }
}
