import * as THREE from '/node_modules/three108/build/three.module.js'
import { keyboard, Kamenko } from '/classes/index.js'
import { createPlayerBox } from '/utils/boxes.js'
import { addSolids, raycastGround } from '/classes/actions/index.js'
import { getHeight } from '/utils/helpers.js'

const { pressed } = keyboard
const { LoopOnce, LoopRepeat, Vector3, AnimationMixer } = THREE

let a = 0 // for debuging

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
    this.debugAnimations()
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
    this.playAnimation(this.animNames.walk, LoopRepeat)
  }

  turn(angle) {
    this.mesh.rotateY(angle)
  }

  fall(jumpStep) {
    if (this.position.y == this.groundY) return
    if (this.position.y - jumpStep >= this.groundY) {
      this.mesh.translateY(-jumpStep)
      this.playAnimation(this.animNames.fall, LoopOnce)
    }
    // if (this.position.y < this.groundY) this.mesh.translateY(jumpStep)
  }

  jump(jumpStep) {
    this.mesh.translateY(jumpStep)
    this.playAnimation(this.animNames.jump, LoopOnce)
  }

  attack() {
    this.playAnimation(this.animNames.attack, LoopOnce)
  }

  special() {
    this.playAnimation(this.animNames.special, LoopOnce)
  }

  /* INPUT */

  handleInput(delta) {
    this.running = keyboard.capsLock
    const speed = this.running ? this.speed * 2 : this.speed
    const step = speed * delta // speed in pixels per second
    const jumpStep = speed * delta * 1.5
    const turnAngle = Math.PI / 2 * delta

    if (!pressed.Space) this.fall(jumpStep)

    if (!keyboard.keyPressed || this.loopOncePressed) this.idle()
    if (!pressed.mouse && !pressed.mouse2 && !pressed.Space) this.loopOncePressed = false

    if (keyboard.left) this.turn(turnAngle)
    if (keyboard.right) this.turn(-turnAngle)

    if (pressed.mouse) this.attack()
    if (pressed.mouse2) this.special()

    if (this.directionBlocked()) return

    if (pressed.Space) this.jump(jumpStep)

    if (keyboard.up) this.walk(-step)
    if (keyboard.down) this.walk(step)
    if (pressed.KeyQ) this.sideWalk(-step)
    if (pressed.KeyE) this.sideWalk(step)
  }

  /* ANIMATIONS */

  shouldNotPlay(nextClip, nextLoop) {
    const { action } = this
    return action && (
      action._clip.name == nextClip || // don't start the same clip over again
      action.loop == LoopOnce && action.isRunning() || // wait one-time animation to finish
      nextLoop === LoopOnce && this.loopOncePressed // don't play one-time animations twice
    )
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

  debugAnimations() {
    document.addEventListener('click', () => {
      const { name } = this.animations[a++ % this.animations.length]
      console.log(name)
      this.playAnimation(name)
    })
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
