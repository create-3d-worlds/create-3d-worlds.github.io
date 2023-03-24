import { Vector3, MathUtils } from 'three'
import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js'

import { Input } from '/utils/classes/Input.js'
import Actor from './Actor.js'
import { getAIState } from './states/index.js'
import { jumpStyles, attackStyles, baseAiStates, pursueStates } from '/utils/constants.js'

const { randFloatSpread } = MathUtils

const walkAnims = ['wander', 'follow', 'patrol']
const runAnims = ['pursue', 'flee']

export default class AI extends Actor {
  constructor({
    jumpStyle = jumpStyles.FALSE_JUMP, attackStyle = attackStyles.LOOP, baseState = baseAiStates.wander, speed = 1.8, shouldRaycastGround = false, sightDistance = 25, followDistance = 1.5, patrolDistance = 10, attackDistance = 1.25, target, ...params
  } = {}) {
    super({
      ...params,
      speed,
      attackDistance,
      input: new Input(false),
      getState: name => getAIState(name, jumpStyle, attackStyle),
      shouldRaycastGround,
    })
    this.mesh.name = 'enemy'
    if (target) {
      this.target = target
      this.addSolids(target)
    }
    this.baseState = baseState
    this.followDistance = followDistance
    this.sightDistance = sightDistance
    this.patrolDistance = patrolDistance

    this.randomizeAction()
    this.mesh.rotateY(Math.random() * Math.PI * 2)

    if (params.mapSize && !params.coords)
      this.position.set(randFloatSpread(params.mapSize), 0, randFloatSpread(params.mapSize))

    this.setState(baseState)
  }

  /* GETTERS */

  get inPursueState() {
    return pursueStates.includes(this.baseState)
  }

  get distancToTarget() {
    if (!this.target) return Infinity
    return this.position.distanceTo(this.target.position)
  }

  get lookingAtTarget() {
    if (!this.target) return false
    const direction1 = this.mesh.getWorldDirection(new Vector3())
    const direction2 = this.target.getWorldPosition(new Vector3())
      .sub(this.mesh.getWorldPosition(new Vector3())).normalize()
    const dotProduct = direction1.dot(direction2)

    return (-1.3 < dotProduct && dotProduct < -0.7)
  }

  get targetInRange() {
    if (!this.target) return false
    return this.distancToTarget < this.sightDistance
  }

  get targetAbove() {
    if (!this.target) return false
    return this.target.position.y >= this.position.y + this.height * .5
  }

  get targetSpotted() {
    if (!this.target) return false
    if (this.targetAbove) return false
    return (this.targetInRange && this.lookingAtTarget) || (this.targetInRange * .3) // feel if too close
  }

  /* ANIMS */

  setupMixer(animations, animDict) {
    const { actions } = this
    super.setupMixer(animations, animDict)
    walkAnims.forEach(name => {
      if (!actions[name]) actions[name] = actions.walk
    })
    runAnims.forEach(name => {
      if (!actions[name]) actions[name] = actions.run
    })
  }

  randomizeAction() {
    if (!this.action) return
    this.action.time = Math.random() * this.action.getClip().duration
  }

  /* UTILS */

  addSolids(solids) {
    const notMe = Array.isArray(solids)
      ? solids.filter(solid => solid !== this.mesh)
      : solids
    super.addSolids(notMe)
  }

  lookAtTarget() {
    if (!this.target) return
    const { x, z } = this.target.position
    const newPos = new Vector3(x, this.position.y, z)
    this.mesh.lookAt(newPos)
    this.mesh.rotateY(Math.PI)
  }

  turnSmooth(angle = Math.PI, duration = 2500) {
    new TWEEN.Tween(this.mesh.rotation)
      .to({ y: this.mesh.rotation.y + angle }, duration)
      .start()
  }

  /* COMBAT */

  hit(mesh, range = [15, 35]) {
    if (!this.lookingAtTarget) return
    super.hit(mesh, range)
  }

  attackAction(name = 'player') {
    this.lookAtTarget()
    this.mesh.rotateY(randFloatSpread(Math.PI / 16))
    super.attackAction(name)
  }

  /* UPDATE */

  checkTarget() {
    if (this?.target?.userData?.energy <= 0)
      this.target = null
  }

  update(delta) {
    super.update(delta)
    this.checkTarget()
  }
}
