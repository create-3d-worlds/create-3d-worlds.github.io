import * as THREE from '/node_modules/three108/build/three.module.js'
import { keyboard, Kamenko } from '/classes/index.js'
import { createPlayerBox } from '/utils/boxes.js'
import { addSolids, raycastGround } from '/classes/actions/index.js'
import { getSize } from '/utils/helpers.js'

const { pressed } = keyboard
const { LoopOnce, LoopRepeat, Vector3 } = THREE

let a = 0 // for debuging

/**
 * Player handle user input, move mesh and animate model.
 */
export default class Player {
  constructor({ size, transparent = false, mesh = createPlayerBox(size, transparent), animations, animNames } = {}) {
    this.mesh = mesh
    // TODO: resize mesh if size is set
    this.size = mesh ? getSize(mesh).y : size
    this.speed = this.size * 2
    this.solids = []
    this.groundY = 0
    if (animations) {
      this.mixer = new THREE.AnimationMixer(mesh)
      this.animations = animations
      this.animNames = animNames
    }
  }

  /* MOVEMENTS */

  idle() {
    this.playAnimation(this.animNames.idle, LoopRepeat)
  }

  walk(step) {
    this.mesh.translateZ(step)
    const animation = this.running ? this.animNames.run : this.animNames.walk
    this.playAnimation(animation, LoopRepeat)
  }

  sideWalk(step) {
    this.mesh.translateX(step)
    this.playAnimation(this.animNames.sideWalk || this.animNames.walk, LoopRepeat)
  }

  jump(stepY) {
    this.mesh.translateY(stepY)
    this.playAnimation(this.animNames.jump, LoopOnce)
  }

  turn(angle) {
    this.mesh.rotateY(angle)
  }

  freeFall(stepY) {
    if (this.position.y > this.groundY)
      if (this.position.y - stepY >= this.groundY) this.mesh.translateY(-stepY)
    // if (this.position.y < this.groundY) this.mesh.translateY(stepY)
  }

  /* USER INPUT */

  handleMove(delta) {
    this.running = keyboard.capsLock
    const speed = this.running ? this.speed * 2 : this.speed
    const step = speed * delta // speed in pixels per second
    const jumpStep = speed * delta * 1.5
    const turnAngle = Math.PI / 2 * delta

    if (!pressed.Space) this.freeFall(jumpStep)

    if (!keyboard.keyPressed) this.idle()

    if (keyboard.left) this.turn(turnAngle)
    if (keyboard.right) this.turn(-turnAngle)

    if (this.directionBlocked()) return

    if (keyboard.up) this.walk(-step)
    if (keyboard.down) this.walk(step * .5)
    if (pressed.KeyQ) this.sideWalk(-step)
    if (pressed.KeyE) this.sideWalk(step)
    if (pressed.Space) this.jump(jumpStep)
  }

  updateGround() {
    this.groundY = raycastGround(this, { y: this.size * 2 })
  }

  /* RAYCAST */

  chooseRaycastVector() {
    if (pressed.Space && keyboard.up) return new Vector3(0, 1, -1)
    if (keyboard.up) return new Vector3(0, 0, -1)
    if (keyboard.down) return new Vector3(0, 0, 1)
    if (keyboard.left) return new Vector3(-1, 0, 0)
    if (keyboard.right) return new Vector3(1, 0, 0)
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

  /* ANIMATIONS */

  shouldFinish(name) {
    const { action } = this
    return action && (
      action.loop == LoopOnce && action.isRunning() // finish one-time action
      || action._clip.name == name && action.loop == LoopRepeat // don't start same repeating action
    )
  }

  playAnimation(name, loop) {
    if (!this.mixer) return
    if (this.shouldFinish(name)) return
    if (this.action) this.action.stop()
    const clip = this.animations.find(c => c.name == name)
    this.action = this.mixer.clipAction(clip)
    this.action.setLoop(loop)
    this.action.play()
  }

  debugAnimations() {
    document.addEventListener('click', () => {
      const { name } = this.animations[a++ % this.animations.length]
      console.log(name)
      this.playAnimation(name)
    })
  }

  /* LOOP */

  update(delta) {
    this.updateGround()
    this.handleMove(delta)
    if (this.mixer) this.mixer.update(delta)
  }
}

// TODO: DELETE!!!!
/**
 * Bridge between Player and Model.
 * @param ModelClass is used to load `mesh`.
 * @param callback is used to pass `mesh` to the scene.
 */
export class PlayerModel extends Player {
  constructor(x, y, z, size, callback, ModelClass) {
    super({ x, y, z, size })
    this.model = new ModelClass(mesh => {
      this.mesh = mesh
      mesh.position.set(x, y, z)
      callback(mesh)
    }, size)
  }
}

export class PlayerAvatar extends Player {
  constructor(x, y, z, size, skin) {
    super({ x, y, z, size })
    this.model = new Kamenko(x, y, z, size, skin)
    this.mesh = this.model.mesh
  }
}
