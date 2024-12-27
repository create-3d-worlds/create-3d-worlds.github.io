import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

import GameObject from '/core/objects/GameObject.js'
import { getGroundY, directionBlocked, getMesh, intersect, belongsTo } from '/core/helpers.js'
import { dir, RIGHT_ANGLE, reactions, jumpStyles } from '/core/constants.js'
import config from '/config.js'

const { randInt } = THREE.MathUtils

const getParent = (object, name) =>
  object.name === name ? object : getParent(object.parent, name)

/**
 * Base abstract class for AI and Player; handles movement, animations...
 * @param animDict: maps state to animation
 */
export default class Actor extends GameObject {

  constructor({
    animations,
    animDict,
    input,
    speed = 2,
    jumpStyle,
    gravity = 42,
    jumpForce = gravity * 1.66,
    maxVelocityY = gravity / 3, // actually much greater than gravity with applied delta
    maxJumpTime = .28,
    drag = 0.5,
    getState,
    twoHandedWeapon,
    rightHandWeapon,
    mapSize,
    attackDistance,
    hitColor = 0x8a0303,
    runCoefficient = 2,
    leaveDecals = attackDistance > 9,
    useRicochet = attackDistance > 9,
    attackSound = '',
    altitude = 0, // for flying objects
    shouldRaycastGround = Boolean(altitude),
    flame = null,
    turnWhileAttack = !flame,
    ...rest
  }) {
    super({ altitude, ...rest })
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
    this.actions = {}
    this.getState = getState
    this.shouldRaycastGround = shouldRaycastGround
    this.runCoefficient = runCoefficient
    this.attackDistance = this.depth > attackDistance ? Math.ceil(this.depth) : attackDistance
    this.attackSound = attackSound
    this.useRicochet = useRicochet
    this.leaveDecals = leaveDecals
    this.altitude = altitude
    this.turnWhileAttack = turnWhileAttack

    if (animations?.length && animDict) {
      this.setupMixer(animations, animDict)
      if (twoHandedWeapon) this.addTwoHandedWeapon(clone(twoHandedWeapon))
      if (rightHandWeapon) this.addRightHandWeapon(clone(rightHandWeapon))
    }

    if (attackSound) {
      this.audio = new Audio(`/assets/sounds/${attackSound}`)
      this.audio.volume = config.volume
    }

    if (mapSize) {
      const halfMap = mapSize / 2
      this.boundaries = new THREE.Box3(
        new THREE.Vector3(-halfMap, 0, -halfMap), new THREE.Vector3(halfMap, 0, halfMap)
      )
    }

    if (useRicochet) {
      const promise = import('/core/Particles.js')
      promise.then(obj => {
        const Particles = obj.default
        this.ricochet = new Particles({ num: 100, size: .05, unitAngle: 0.2 })
      })
    }

    if (flame) {
      const promise = import('/core/Particles.js')
      promise.then(obj => {
        const { Flame } = obj
        this.flame = new Flame({ num: 25, minRadius: 0, maxRadius: .5 })
        this.flame.mesh.material.opacity = 0
      })
    }

    if (leaveDecals) {
      const promise = import('/core/decals.js')
      promise.then(obj => {
        this.shootDecals = obj.shootDecals
      })
    }

    this.setState('idle')
  }

  /* GETTERS & SETTERS */

  get heightDifference() {
    return this.mesh.position.y - this.groundY
  }

  get inAir() {
    if (!this.shouldRaycastGround) return false

    return this.heightDifference > this.height * .25
  }

  get onGround() {
    if (!this.shouldRaycastGround) return true

    return this.heightDifference <= .001
  }

  get action() {
    return this.currentState.action
  }

  get state() {
    return this.currentState?.name
  }

  get acceleration() {
    const { input, speed, runCoefficient } = this
    if (input.screen?.forward)
      return speed * -input.screen.forward * (input.up ? runCoefficient : runCoefficient * .75)

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

  get ableToJump() {
    return this.actions.jump || this.jumpStyle != jumpStyles.ANIM_JUMP
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

  playAttackSound() {
    this.audio.currentTime = 0
    this.audio.play()
  }

  enterAttack(name, height) {
    const timeToHit = this.action ? (this.action.getClip().duration * 1000 * .5) : 200

    setTimeout(() => {
      if (this.dead) return
      if (this.attackSound) this.playAttackSound()

      const intersects = this.intersect(height)
      if (!intersects.length) return

      const { point, object, distance } = intersects[0]
      if (distance > this.attackDistance) return

      if (belongsTo(object, name)) {
        const mesh = getParent(object, name)
        this.hit(mesh)
        if (this.useRicochet) this.addRicochet(point, mesh.userData.hitColor)
      } else if (this.leaveDecals) { // if not hit enemy
        this.addRicochet(point, 0xcccccc)
        this.shootDecals(intersects[0], { scene: this.scene, color: 0x000000 })
      }
    }, timeToHit)
  }

  /* PARTICLES */

  addRicochet(pos, color) {
    this.ricochet.reset({ pos, unitAngle: 0.2, color })
    this.scene.add(this.ricochet.mesh)
  }

  resetFlame(randomize = true) {
    const { flame, mesh } = this
    flame.reset({ pos: this.position, randomize })
    flame.mesh.rotation.copy(mesh.rotation)
    flame.mesh.rotateX(Math.PI)
    flame.mesh.translateY(-1.2)
    flame.mesh.translateZ(1.75)
    this.shouldLoop = true
  }

  startFlame(defer = 1000, callback, randomize) {
    this.scene.add(this.flame.mesh)
    setTimeout(() => {
      this.resetFlame(randomize)
      if (callback) callback()
    }, defer)
  }

  endFlame() {
    this.shouldLoop = false
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

  /* UPDATES */

  updateRifle() {
    const pos = new THREE.Vector3()
    this.leftHand.getWorldPosition(pos)
    this.twoHandedWeapon.lookAt(pos)
  }

  checkHit() {
    if (!this.hitAmount) return

    this.applyDamage()

    if (this.dead)
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
    const direction = this.input.up ? dir.forward
      : this.input.down ? dir.backward : null

    if (direction && this.directionBlocked(direction))
      if (reaction == reactions.BOUNCE) this.bounce()
      else if (reaction == reactions.TURN_SMOOTH) this.turnSmooth()
      else if (reaction == reactions.STEP_OFF) this.stepOff(delta * 2.5)
      else if (reaction == reactions.STOP) return

    if (this.state == 'jump') {
      const jumpDir = this.input.up ? dir.upForward
        : this.input.down ? dir.upBackward : null
      if (jumpDir && this.directionBlocked(jumpDir)) return
    }

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

    if (this.input.strafeLeft && !this.directionBlocked(dir.left))
      this.mesh.translateX(-acceleration * delta)

    if (this.input.strafeRight && !this.directionBlocked(dir.right))
      this.mesh.translateX(acceleration * delta)
  }

  updateGround() {
    const { solids } = this
    if (!solids || !this.shouldRaycastGround) return

    this.groundY = getGroundY({ pos: this.position, solids, y: this.height }) + this.altitude
  }

  applyGravity(delta) {
    if (this.velocity.y > -this.maxVelocityY)
      this.velocity.y -= this.gravity * delta
  }

  applyVelocityY(delta) {
    const deltaVelocity = this.velocity.y * delta
    if (this.mesh.position.y + deltaVelocity > this.groundY)
      this.mesh.translateY(deltaVelocity)
    else
      this.mesh.position.y = this.groundY
  }

  updateFlame(delta) {
    this.flame?.update({ delta, max: this.attackDistance, loop: this.shouldLoop, minVelocity: 2.5, maxVelocity: 5 })
  }

  update(delta = 1 / 60) {
    this.updateGround()
    this.currentState.update(delta)
    this.mixer?.update(delta)
    if (!this.dead && !['jump', 'fall'].includes(this.state))
      this.handleTerrain(2 * delta)

    this.checkHit()

    if (this.twoHandedWeapon) this.updateRifle()
    if (this.outOfBounds) this.bounce()

    if (this.useRicochet) this.ricochet?.expand({ velocity: 1.2, maxRounds: 5, gravity: .02 })
    if (this.flame) this.updateFlame(delta)
  }
}
