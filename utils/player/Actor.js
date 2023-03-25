import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js'

import { createOrbitControls } from '/utils/scene.js'
import CameraFollow from '/utils/classes/CameraFollow.js'
import { addSolids, findGround, getSize, directionBlocked, getMesh, putOnGround, raycast, getParent, belongsTo } from '/utils/helpers.js'
import { dir, RIGHT_ANGLE, reactions } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry.js'

const { randInt } = THREE.MathUtils

/**
 * Base abstract class for AI and Player, handles movement, animations...
 * @param animDict: maps finite state to animation
 ** anim keys: idle, walk, run, jump, fall, attack, attack2, special, pain, death
 */
export default class Actor {
  constructor({
    mesh = createPlayerBox(), animations, animDict, camera, input, solids, gravity = .7, jumpStyle, speed = 2, jumpForce = gravity * 1.66, maxJumpTime = 17, fallLimit = gravity * 20, drag = 0.5, getState, shouldRaycastGround, rifle, pistol, mapSize, coords, attackDistance, hitColor = 0x8a0303, energy = 100, runCoefficient = 2,
  }) {
    this.mesh = clone(mesh)
    this.mesh.userData.hitAmount = 0
    this.mesh.userData.energy = energy
    this.mesh.userData.hitColor = hitColor
    this.speed = speed
    this.solids = []
    this.groundY = 0
    this.gravity = gravity
    this.velocity = new THREE.Vector3()
    this.fallLimit = fallLimit
    this.jumpStyle = jumpStyle
    this.maxJumpTime = maxJumpTime
    this.jumpForce = jumpForce
    this.drag = drag
    this.input = input
    this.getState = getState
    this.shouldRaycastGround = shouldRaycastGround
    this.runCoefficient = runCoefficient
    this.attackDistance = this.depth > attackDistance ? Math.ceil(this.depth) : attackDistance

    this.actions = {}

    if (animations?.length && animDict) {
      this.setupMixer(animations, animDict)
      if (rifle) this.addRifle(clone(rifle))
      if (pistol) this.addPistol(clone(pistol))
    }

    if (coords) this.position.copy(coords.pop())

    if (camera) {
      this.cameraFollow = new CameraFollow({ camera, mesh: this.mesh, height: this.height })
      this.orbitControls = createOrbitControls()
      this.orbitControls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE }
    }

    if (solids) {
      this.addSolids(solids)
      if (shouldRaycastGround) this.putOnGround()
    }

    if (mapSize) {
      const halfMap = mapSize / 2
      this.boundaries = new THREE.Box3(new THREE.Vector3(-halfMap, 0, -halfMap), new THREE.Vector3(halfMap, 0, halfMap))
    }

    this.setState('idle')
  }

  /* GETTERS & SETTERS */

  get position() {
    return this.mesh.position
  }

  set position(pos) {
    this.mesh.position.copy(pos)
    this.putOnGround()
  }

  get name() {
    return this.mesh.name
  }

  set name(name) {
    this.mesh.name = name
  }

  get energy() {
    return this.mesh.userData.energy
  }

  set energy(energy) {
    this.mesh.userData.energy = energy
  }

  get hitAmount() {
    return this.mesh.userData.hitAmount
  }

  set hitAmount(hitAmount) {
    this.mesh.userData.hitAmount = hitAmount
  }

  get isDead() {
    return this.energy <= 0
  }

  get isAlive() {
    return !this.isDead
  }

  get height() {
    return getSize(this.mesh, 'y')
  }

  get depth() {
    return getSize(this.mesh, 'z')
  }

  get heightDifference() {
    return this.mesh.position.y - this.groundY
  }

  get inAir() {
    if (!this.shouldRaycastGround) return false

    return this.heightDifference > .001
  }

  get action() {
    return this.currentState.action
  }

  get state() {
    this.currentState.name
  }

  get acceleration() {
    const { input, speed, runCoefficient } = this
    if (input.amountForward) return speed * -input.amountForward * (input.up ? 2 : 1.5)

    if (input.up) return speed * (input.run ? runCoefficient : 1)
    if (input.down) return -speed * (input.run ? runCoefficient * .75 : 1)

    return 0
  }

  get outOfBounds() {
    if (!this.boundaries) return false
    return this.position.x >= this.boundaries.max.x
      || this.position.x <= this.boundaries.min.x
      || this.position.z >= this.boundaries.max.z
      || this.position.z <= this.boundaries.min.z
  }

  /* STATE MACHINE */

  setState(name) {
    const oldState = this.currentState
    if (oldState) {
      if (oldState.name == name) return
      oldState.exit()
    }
    const State = this.getState(name)
    this.currentState = new State(this, name)
    this.currentState.enter(oldState, oldState?.action)
  }

  /* ANIMATIONS */

  setupMixer(animations, animDict) {
    this.mixer = new THREE.AnimationMixer(getMesh(this.mesh))
    for (const key in animDict) {
      const clip = animations.find(anim => anim.name == animDict[key])
      this.actions[key] = this.mixer.clipAction(clip)
    }
    if (!animDict.run && animDict.walk) {
      const clip = animations.find(anim => anim.name == animDict.walk)
      this.actions.run = this.createRun(clip)
    }
  }

  createRun(walk) {
    return this.mixer.clipAction(walk.clone()).setEffectiveTimeScale(1.5)
  }

  findHands() {
    this.rightHand = null
    this.leftHand = null
    this.mesh.traverse(child => {
      if (child.name === 'mixamorigRightHand') this.rightHand = child
      if (child.name === 'mixamorigLeftHandMiddle1') this.leftHand = child
    })
  }

  addRifle(mesh) {
    if (!this.rightHand || !this.leftHand) this.findHands()
    this.rightHand.add(mesh)
    this.rifle = mesh
  }

  addPistol(mesh) {
    if (!this.rightHand) this.findHands()
    this.rightHand.add(mesh)
  }

  /* UTILS */

  add(obj) {
    this.mesh.add(obj)
  }

  addSolids(...newSolids) {
    addSolids(this.solids, ...newSolids)
  }

  handleRoughTerrain(step) {
    if (!this.heightDifference) return

    if (this.heightDifference < 0)
      this.mesh.translateY(step)

    if (this.heightDifference > 0 && this.heightDifference <= step)
      this.mesh.position.y = this.groundY
  }

  directionBlocked(dir, solids = this.solids) {
    return directionBlocked(this.mesh, solids, dir)
  }

  turn(angle) {
    this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle)
  }

  bounce(angle = Math.PI) {
    this.turn(angle)
    this.mesh.translateZ(this.velocity.z)
  }

  putOnGround() {
    putOnGround(this.mesh, this.solids)
  }

  /* COMBAT */

  raycast() {
    const intersects = raycast(this.mesh, this.solids, dir.forward, this.height, this.attackDistance)
    return intersects[0]?.object
  }

  hit(mesh, range = [35, 55]) {
    const distance = this.position.distanceTo(mesh.position)
    if (distance <= this.attackDistance)
      mesh.userData.hitAmount = randInt(...range)
  }

  attackAction(name) {
    const object = this.raycast()
    if (!belongsTo(object, name)) return

    const timeToHit = this.action ? this.action.getClip().duration * 500 : 500

    setTimeout(() => {
      this.hit(getParent(object, name))
    }, timeToHit)
  }

  /* UPDATES */

  updateRifle() {
    const pos = new THREE.Vector3()
    this.leftHand.getWorldPosition(pos)
    this.rifle.lookAt(pos)
  }

  checkHit() {
    const { userData } = this.mesh
    if (!userData.hitAmount) return

    const newAmount = this.energy - userData.hitAmount
    this.energy = newAmount > 0 ? newAmount : 0
    userData.hitAmount = 0

    if (this.isDead)
      this.setState('death')
    else
      this.setState('pain')
  }

  stepOff(val) {
    this.mesh.translateX(val)
    this.mesh.translateZ(val)
  }

  turnSmooth() {
    this.bounce() // implement in children classes
  }

  updateMove(delta, reaction = reactions.BOUNCE) {
    const direction = this.input.up ? dir.forward : dir.backward

    if (this.directionBlocked(direction))
      if (reaction == reactions.BOUNCE) this.bounce()
      else if (reaction == reactions.TURN_SMOOTH) this.turnSmooth()
      else if (reaction == reactions.STEP_OFF) this.stepOff(delta * 2.5)
      else if (reaction == reactions.STOP) return

    if (this.state != 'jump') this.handleRoughTerrain(Math.abs(this.acceleration) * delta)

    const jumpDir = this.input.up ? dir.upForward : dir.upBackward
    if (this.state == 'jump' && this.directionBlocked(jumpDir)) return

    this.velocity.z += -this.acceleration * delta
    this.velocity.z *= (1 - this.drag)
    this.mesh.translateZ(this.velocity.z)
  }

  updateTurn(delta) {
    if (!delta) return
    const angle = (this.input.run ? RIGHT_ANGLE : RIGHT_ANGLE * .75) * delta // angle per second

    if (this.input.left)
      this.turn(angle)
    if (this.input.right)
      this.turn(angle * -1)
  }

  updateStrafe(delta) {
    const acceleration = this.speed * (this.input.run ? this.runCoefficient : 1)

    if (this.input.sideLeft && !this.directionBlocked(dir.left))
      this.mesh.translateX(-acceleration * delta)

    if (this.input.sideRight && !this.directionBlocked(dir.right))
      this.mesh.translateX(acceleration * delta)
  }

  updateGround() {
    const { mesh, solids } = this
    if (!solids || !this.shouldRaycastGround) return

    const intersect = findGround({ pos: mesh.position, solids, y: this.height })

    this.groundY = intersect ? intersect.point.y : 0
  }

  applyGravity(delta) {
    if (this.velocity.y > -this.fallLimit * delta)
      this.velocity.y -= this.gravity * delta
  }

  applyVelocityY() {
    if (this.mesh.position.y + this.velocity.y > this.groundY)
      this.mesh.translateY(this.velocity.y)
    else
      this.mesh.position.y = this.groundY
  }

  updateCamera(delta) {
    const { x, y, z } = this.mesh.position
    const { lookAt } = this.cameraFollow

    if (this.input.pressed.mouse2)
      this.orbitControls.target = new THREE.Vector3(x, y + lookAt[1], z)
    else
      this.cameraFollow.update(delta, this.currentState.name)
  }

  update(delta = 1 / 60) {
    this.updateGround()
    this.currentState.update(delta)
    this.mixer?.update(delta)

    this.checkHit()

    if (this.rifle) this.updateRifle()
    if (this.outOfBounds) this.bounce()
    if (this.cameraFollow) this.updateCamera(delta)

    TWEEN.update()
  }
}
