import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js'

import GameObject from '/utils/actor/GameObject.js'
import { getGroundY, directionBlocked, getMesh, intersect, getParent, belongsTo } from '/utils/helpers.js'
import { dir, RIGHT_ANGLE, reactions } from '/utils/constants.js'
import { createPlayerBox } from '/utils/geometry.js'
import { shootDecals } from '/utils/decals.js'
import Particles from '/utils/classes/Particles.js'
import config from '/config.js'

const { randInt } = THREE.MathUtils

/**
 * Base abstract class for AI and Player, handles movement, animations...
 * @param animDict: maps state to animation
 */
export default class Actor extends GameObject {
  #solids = []

  constructor({
    mesh = createPlayerBox(),
    name,
    pos,
    solids,
    animations,
    animDict,
    input,
    gravity = .7,
    jumpStyle,
    speed = 2,
    jumpForce = gravity * 1.66,
    maxJumpTime = 17,
    maxVelocityY = gravity * 20,
    drag = 0.5,
    getState,
    shouldRaycastGround,
    twoHandedWeapon,
    rightHandWeapon,
    mapSize,
    attackDistance,
    hitColor = 0x8a0303,
    energy = 100,
    runCoefficient = 2,
    useRicochet = Boolean(twoHandedWeapon || rightHandWeapon),
    leaveDecals = attackDistance > 5,
    attackSound = '',
    altitude = 0, // for flying objects
  }) {
    super({ mesh, name, pos, solids })
    this.mesh.userData.hitAmount = 0
    this.mesh.userData.energy = energy
    this.mesh.userData.hitColor = hitColor
    this.speed = speed
    this.groundY = 0
    this.gravity = gravity
    this.velocity = new THREE.Vector3()
    this.maxVelocityY = maxVelocityY
    this.jumpStyle = jumpStyle
    this.maxJumpTime = maxJumpTime
    this.jumpForce = jumpForce
    this.drag = drag
    this.input = input
    this.getState = getState
    this.shouldRaycastGround = shouldRaycastGround
    this.runCoefficient = runCoefficient
    this.attackDistance = this.depth > attackDistance ? Math.ceil(this.depth) : attackDistance
    this.attackSound = attackSound
    this.useRicochet = useRicochet
    this.leaveDecals = leaveDecals
    this.altitude = altitude
    this.actions = {}

    if (solids) this.addSolids(solids)

    if (animations?.length && animDict) {
      this.setupMixer(animations, animDict)
      if (twoHandedWeapon) this.addTwoHandedWeapon(clone(twoHandedWeapon))
      if (rightHandWeapon) this.addRightHandWeapon(clone(rightHandWeapon))
    }

    if (attackSound) {
      this.audio = new Audio(`/assets/sounds/${attackSound}`)
      this.audio.volume = config.volume
    }

    if (useRicochet) this.ricochet = new Particles({ num: 100, size: .05, unitAngle: 0.2 })

    if (mapSize) {
      const halfMap = mapSize / 2
      this.boundaries = new THREE.Box3(
        new THREE.Vector3(-halfMap, 0, -halfMap), new THREE.Vector3(halfMap, 0, halfMap)
      )
    }

    this.setState('idle')
  }

  /* GETTERS & SETTERS */

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
    return this.currentState?.name
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

  get solids() {
    return this.#solids
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
      this.actions.run = this.mixer.clipAction(clip.clone()).setEffectiveTimeScale(1.5)
    }
  }

  findHands() {
    this.rightHand = null
    this.leftHand = null
    this.mesh.traverse(child => {
      if (child.name === 'mixamorigRightHand') this.rightHand = child
      if (child.name === 'mixamorigLeftHandMiddle1') this.leftHand = child
    })
  }

  addTwoHandedWeapon(mesh) {
    if (!this.rightHand || !this.leftHand) this.findHands()
    this.rightHand.add(mesh)
    this.twoHandedWeapon = mesh
  }

  addRightHandWeapon(mesh) {
    if (!this.rightHand) this.findHands()
    this.rightHand.add(mesh)
  }

  /* COMBAT */

  intersect(height = this.height * .75) {
    return intersect(this.mesh, this.solids, dir.forward, height)
  }

  hit(mesh, damage = [35, 55]) {
    const distance = this.distanceTo(mesh)
    if (distance <= this.attackDistance)
      mesh.userData.hitAmount = randInt(...damage)
  }

  explode(pos, color) {
    this.ricochet.reset({ pos, unitAngle: 0.2, color })
    this.scene.add(this.ricochet.mesh)
  }

  playAttackSound() {
    this.audio.currentTime = 0
    this.audio.play()
  }

  enterAttack(name, height) {
    const timeToHit = this.action ? (this.action.getClip().duration * 1000 * .5) : 200

    setTimeout(() => {
      if (this.attackSound) this.playAttackSound()

      const intersects = this.intersect(height)
      if (!intersects.length) return

      const { point, object, distance } = intersects[0]
      if (distance > this.attackDistance) return

      if (belongsTo(object, name)) {
        const mesh = getParent(object, name)
        this.hit(mesh)
        if (this.useRicochet) this.explode(point, mesh.userData.hitColor)
      } else if (this.leaveDecals) { // if not hit enemy
        this.explode(point, 0xcccccc)
        shootDecals(intersects[0], { scene: this.scene, color: 0x000000 })
      }
    }, timeToHit)
  }

  /* UTILS */

  handleTerrain(step) {
    if (this.heightDifference == 0) return

    if (Math.abs(this.heightDifference) <= step) {
      this.mesh.position.y = this.groundY
      return
    }

    if (this.heightDifference < 0)
      this.mesh.translateY(step)

    if (this.heightDifference > 0)
      this.mesh.translateY(-step)

  }

  directionBlocked(currDir, solids = this.solids) {
    const rayLength = currDir == dir.forward ? this.depth : this.height
    return directionBlocked(this.mesh, solids, currDir, rayLength)
  }

  turn(angle) {
    this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle)
  }

  bounce(angle = Math.PI) {
    this.turn(angle)
    this.mesh.translateZ(this.velocity.z)
  }

  lookAt(pos) {
    this.mesh.lookAt(pos)
    this.mesh.rotateY(Math.PI)
  }

  pushToSolids = obj => {
    if (obj !== this.mesh && !this.#solids.includes(obj))
      this.#solids.push(obj)
  }

  /**
   * Add solid objects to collide (terrain, walls, actors, etc.)
   * @param {array of meshes, mesh or meshes} newSolids
   */
  addSolids(...newSolids) {
    newSolids.forEach(newSolid => {
      if (Array.isArray(newSolid)) newSolid.forEach(this.pushToSolids)
      else this.pushToSolids(newSolid)
    })
  }

  /* UPDATES */

  updateRifle() {
    const pos = new THREE.Vector3()
    this.leftHand.getWorldPosition(pos)
    this.twoHandedWeapon.lookAt(pos)
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

    const flying = ['jump', 'fall']
    if (!flying.includes(this.state)) this.handleTerrain(Math.abs(this.acceleration) * delta)

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
    const { solids } = this
    if (!solids || !this.shouldRaycastGround) return

    this.groundY = getGroundY({ pos: this.position, solids, y: this.height }) + this.altitude
  }

  applyGravity(delta) {
    if (this.velocity.y > -this.maxVelocityY * delta)
      this.velocity.y -= this.gravity * delta
  }

  applyVelocityY() {
    if (this.mesh.position.y + this.velocity.y > this.groundY)
      this.mesh.translateY(this.velocity.y)
    else
      this.mesh.position.y = this.groundY
  }

  update(delta = 1 / 60) {
    this.updateGround()
    this.currentState.update(delta)
    this.mixer?.update(delta)

    this.checkHit()

    if (this.twoHandedWeapon) this.updateRifle()
    if (this.outOfBounds) this.bounce()

    if (this.useRicochet) this.ricochet.expand({ velocity: 1.2, maxRounds: 5, gravity: .02 })

    TWEEN.update()
  }
}
